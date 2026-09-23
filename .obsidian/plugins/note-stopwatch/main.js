const { Plugin, ItemView, MarkdownView, TFile, Notice } = require("obsidian");

const VIEW = "note-stopwatch-view";
const validMs = value => Number.isFinite(value) && value >= 0 ? value : 0;
const cleanMap = value => Object.fromEntries(
  Object.entries(value && typeof value === "object" ? value : {})
    .filter(([path, ms]) => path.endsWith(".md") && validMs(ms) > 0)
);

function formatTime(ms) {
  const seconds = Math.floor(validMs(ms) / 1000);
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map(number => String(number).padStart(2, "0")).join(":");
}

function setTextIfChanged(element, text) {
  if (element.textContent !== text) element.setText(text);
}

function localDateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")].join("-");
}

// Timing lives outside the panel, so closing or moving the panel loses no time.
class Stopwatch {
  constructor(saved = {}, now = () => Date.now()) {
    this.now = now;
    this.sessionMs = validMs(saved.sessionMs);
    this.sessionNotes = cleanMap(saved.sessionNotes);
    this.allNotes = cleanMap(saved.allNotes);
    const calendar = saved.calendar || {};
    this.dayKey = calendar.dayKey;
    this.weekKey = calendar.weekKey;
    this.dayNotes = cleanMap(calendar.dayNotes);
    this.weekNotes = cleanMap(calendar.weekNotes);
    this.periodVersion = 0;
    this.unassignedMs = Math.max(0, this.sessionMs -
      Object.values(this.sessionNotes).reduce((sum, ms) => sum + ms, 0));
    this.running = false; // Never count time while Obsidian was closed.
    this.activePath = null;
    this.lastAt = now();
    this.ensurePeriods(this.lastAt);
  }

  ensurePeriods(timestamp, force = false) {
    if (!force && timestamp >= this.dayStartAt && timestamp < this.dayEndAt) return;
    const day = new Date(timestamp);
    day.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setDate(end.getDate() + 1); // Calendar arithmetic handles 23/25-hour DST days.
    const monday = new Date(day);
    monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
    const dayKey = localDateKey(day);
    const weekKey = localDateKey(monday);
    if (dayKey !== this.dayKey) { this.dayKey = dayKey; this.dayNotes = {}; this.periodVersion++; }
    if (weekKey !== this.weekKey) { this.weekKey = weekKey; this.weekNotes = {}; this.periodVersion++; }
    this.dayStartAt = day.getTime();
    this.dayEndAt = end.getTime();
  }

  addCalendarTime(path, start, end) {
    // Split even delayed callbacks at local midnight, including Sunday/Monday.
    let cursor = start;
    while (cursor < end) {
      this.ensurePeriods(cursor);
      const next = Math.min(end, this.dayEndAt);
      for (const map of [this.dayNotes, this.weekNotes]) {
        map[path] = (map[path] || 0) + next - cursor;
      }
      cursor = next;
    }
  }

  notesFor(scope) {
    if (scope === "day") return this.dayNotes;
    if (scope === "week") return this.weekNotes;
    return scope === "session" ? this.sessionNotes : this.allNotes;
  }

  commit() {
    const now = this.now();
    const start = this.lastAt;
    const delta = this.running ? Math.max(0, now - this.lastAt) : 0;
    this.lastAt = now;
    this.sessionMs += delta;
    if (this.activePath && delta) {
      for (const map of [this.sessionNotes, this.allNotes]) {
        map[this.activePath] = (map[this.activePath] || 0) + delta;
      }
      this.addCalendarTime(this.activePath, start, now);
    } else {
      this.unassignedMs += delta;
    }
    this.ensurePeriods(now);
  }

  resume() { this.commit(); this.running = true; }
  stop() { this.commit(); this.running = false; }
  reset() {
    this.stop();
    this.sessionMs = 0;
    this.sessionNotes = {};
    this.unassignedMs = 0;
  }
  setNote(path) { this.commit(); this.activePath = path; }

  rename(oldPath, newPath) {
    this.commit();
    const matches = path => path === oldPath || path.startsWith(oldPath + "/");
    for (const map of [this.sessionNotes, this.allNotes, this.dayNotes, this.weekNotes]) {
      for (const path of Object.keys(map)) {
        if (!matches(path)) continue;
        const renamed = newPath + path.slice(oldPath.length);
        map[renamed] = (map[renamed] || 0) + map[path];
        delete map[path];
      }
    }
    if (this.activePath && matches(this.activePath)) {
      this.activePath = newPath + this.activePath.slice(oldPath.length);
    }
  }

  snapshot() {
    this.commit();
    return {
      version: 2,
      sessionMs: this.sessionMs,
      sessionNotes: { ...this.sessionNotes },
      allNotes: { ...this.allNotes },
      calendar: {
        dayKey: this.dayKey, dayNotes: { ...this.dayNotes },
        weekKey: this.weekKey, weekNotes: { ...this.weekNotes }
      }
    };
  }
}

module.exports = class NoteStopwatch extends Plugin {
  async onload() {
    this.views = new Set();
    this.saveQueue = Promise.resolve();
    // If loading fails, stop loading the plugin instead of overwriting history.
    const saved = await this.loadData();
    this.clock = new Stopwatch(saved || {});
    this.registerView(VIEW, leaf => new StopwatchView(leaf, this));
    this.addRibbonIcon("timer", "Open stopwatch", () => this.openPanel());
    this.addCommand({ id: "open", name: "Open stopwatch", callback: () => this.openPanel() });
    for (const [id, name] of [["resume", "Start"], ["stop", "Stop"], ["reset", "Reset session"]]) {
      this.addCommand({ id, name, callback: () => this.control(id) });
    }

    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.syncNote()));
    this.registerEvent(this.app.workspace.on("file-open", () => this.syncNote()));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      this.clock.rename(oldPath, file.path);
      this.paint(true);
      void this.persist();
    }));
    this.registerEvent(this.app.vault.on("delete", file => {
      const path = this.clock.activePath;
      if (path && (path === file.path || path.startsWith(file.path + "/"))) {
        this.clock.setNote(null);
      }
      this.paint(true);
      void this.persist();
    }));
    this.registerDomEvent(window, "beforeunload", () => {
      this.clock.stop();
      this.updateHeartbeat();
      this.clearCalendarWakeup();
      void this.persist();
    });
    this.registerDomEvent(window, "focus", () => {
      this.clock.commit();
      this.clock.ensurePeriods(this.clock.now(), true);
      this.paint(true);
      this.updateCalendarWakeup();
    });
    this.app.workspace.onLayoutReady(() => {
      this.syncNote();
      // Restore an existing pane; otherwise add one below the left sidebar.
      void this.openPanel();
    });
  }

  syncNote() {
    // Sidebar clicks keep the most recently used central note selected.
    const leaf = this.app.workspace.getMostRecentLeaf(this.app.workspace.rootSplit);
    const view = leaf?.view;
    const file = view instanceof MarkdownView ? view.file : null;
    const path = file?.extension === "md" ? file.path : null;
    if (this.clock.activePath !== path) {
      this.clock.setNote(path);
      this.paint(true);
      if (this.clock.running) void this.persist();
    }
  }

  control(action) {
    this.syncNote();
    this.clock[action]();
    this.updateHeartbeat();
    this.paint(true);
    this.updateCalendarWakeup();
    void this.persist();
  }

  paint(force = false) {
    for (const view of this.views) view.refresh(force);
  }

  updateHeartbeat() {
    if (!this.clock.running) {
      if (this.heartbeatId != null) window.clearInterval(this.heartbeatId);
      this.heartbeatId = null;
      return;
    }
    if (this.heartbeatId != null) return;
    this.lastPeriodicSaveAt = this.clock.now();
    // One timer while running; no scheduled work at all while stopped.
    this.heartbeatId = window.setInterval(() => {
      this.clock.commit();
      this.paint();
      if (this.clock.now() - this.lastPeriodicSaveAt >= 2000) {
        this.lastPeriodicSaveAt = this.clock.now();
        void this.persist();
      }
    }, 1000);
  }

  clearCalendarWakeup() {
    if (this.calendarTimeout != null) window.clearTimeout(this.calendarTimeout);
    this.calendarTimeout = null;
  }

  updateCalendarWakeup() {
    this.clearCalendarWakeup();
    if (this.unloading || this.clock.running ||
      ![...this.views].some(view => view.scope === "day" || view.scope === "week")) return;
    // No stopped polling: a calendar pane needs just one wakeup at midnight.
    this.calendarTimeout = window.setTimeout(() => {
      this.calendarTimeout = null;
      this.clock.commit();
      this.paint(true);
      this.updateCalendarWakeup();
    }, Math.max(1, this.clock.dayEndAt - this.clock.now() + 10));
  }

  persist() {
    const snapshot = this.clock.snapshot();
    // Serialize writes so an older save cannot overwrite a newer one.
    this.saveQueue = this.saveQueue.then(() => this.saveData(snapshot)).then(() => {
      this.saveFailed = false;
    }).catch(error => {
      console.error("Note Stopwatch: could not save", error);
      if (!this.saveFailed) new Notice("Note Stopwatch could not save your time. Check vault access.");
      this.saveFailed = true;
    });
    return this.saveQueue;
  }

  async openPanel() {
    if (this.opening) return this.opening;
    this.opening = (async () => {
      let leaf = this.app.workspace.getLeavesOfType(VIEW)[0];
      if (!leaf) {
        leaf = this.app.workspace.getLeftLeaf(true);
        if (!leaf) return;
        await leaf.setViewState({ type: VIEW });
      }
      await this.app.workspace.revealLeaf(leaf);
    })();
    try { await this.opening; }
    catch (error) {
      console.error("Note Stopwatch: could not open panel", error);
      new Notice("Could not open Note Stopwatch. Try its ribbon button again.");
    } finally { this.opening = null; }
  }

  onunload() {
    this.unloading = true;
    this.clearCalendarWakeup();
    if (this.clock) {
      this.clock.stop();
      this.updateHeartbeat();
      void this.persist();
    }
  }
};

class StopwatchView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.scope = "session";
    this.rows = new Map();
  }
  getViewType() { return VIEW; }
  getDisplayText() { return "Stopwatch"; }
  getIcon() { return "timer"; }

  async onOpen() {
    this.contentEl.empty();
    this.contentEl.addClass("note-stopwatch");
    this.rows.clear();
    const top = this.contentEl.createDiv({ cls: "ns-heading" });
    top.createSpan({ text: "STOPWATCH" });
    this.stateEl = top.createSpan({ cls: "ns-state" });

    const dial = this.contentEl.createDiv({ cls: "ns-dial" });
    dial.createDiv({ text: "THIS SESSION", cls: "ns-eyebrow" });
    this.timeEl = dial.createDiv({ text: "00:00:00", cls: "ns-time" });

    const controls = this.contentEl.createDiv({ cls: "ns-controls" });
    this.stopButton = controls.createEl("button", { text: "Stop" });
    this.resumeButton = controls.createEl("button", { text: "Start", cls: "mod-cta" });
    this.resetButton = controls.createEl("button", { text: "Reset" });
    this.resetButton.title = "Reset this session and stop. Today, this week, and all-time totals are kept.";
    this.stopButton.onclick = () => this.plugin.control("stop");
    this.resumeButton.onclick = () => this.plugin.control("resume");
    this.resetButton.onclick = () => this.plugin.control("reset");

    const current = this.contentEl.createDiv({ cls: "ns-current" });
    current.createDiv({ text: "CURRENT NOTE", cls: "ns-eyebrow" });
    this.noteEl = current.createDiv({ cls: "ns-note-name" });
    this.noteTimeEl = current.createDiv({ cls: "ns-note-time" });

    const heading = this.contentEl.createDiv({ cls: "ns-breakdown-heading" });
    heading.createSpan({ text: "Time by note" });
    this.scopeEl = heading.createEl("select", { attr: { "aria-label": "Note time period" } });
    this.scopeEl.createEl("option", { text: "This session", value: "session" });
    this.scopeEl.createEl("option", { text: "Today", value: "day" });
    this.scopeEl.createEl("option", { text: "This week", value: "week" });
    this.scopeEl.createEl("option", { text: "All time", value: "all" });
    this.scopeEl.value = this.scope;
    this.scopeEl.onchange = () => {
      this.scope = this.scopeEl.value;
      this.refresh(true);
      this.plugin.updateCalendarWakeup();
    };
    this.listEl = this.contentEl.createDiv({ cls: "ns-notes" });
    this.emptyEl = this.contentEl.createDiv({ cls: "ns-empty" });
    this.footerEl = this.contentEl.createDiv({ cls: "ns-footer" });
    this.plugin.views.add(this);
    this.refresh(true);
    this.plugin.updateCalendarWakeup();
  }

  refresh(force = false) {
    const clock = this.plugin.clock;
    clock.commit();
    if (this.lastPeriodVersion !== clock.periodVersion) force = true;
    this.lastPeriodVersion = clock.periodVersion;
    const second = Math.floor(clock.sessionMs / 1000);
    if (!force && this.lastSecond === second) return;
    this.lastSecond = second;
    setTextIfChanged(this.timeEl, formatTime(clock.sessionMs));
    const path = clock.activePath;
    if (force) {
      setTextIfChanged(this.stateEl, clock.running ? "Running" : clock.sessionMs > 0 ? "Stopped" : "Ready");
      this.contentEl.classList.toggle("is-running", clock.running);
      this.stopButton.disabled = !clock.running;
      this.resumeButton.disabled = clock.running;
      this.resetButton.disabled = clock.sessionMs === 0 && !clock.running;
      setTextIfChanged(this.noteEl, path ? path.split("/").pop().replace(/\.md$/, "") : "No note selected");
      this.noteEl.title = path || "Open a Markdown note to track time on it.";
    }
    setTextIfChanged(this.noteTimeEl, path
      ? `${formatTime(clock.sessionNotes[path] || 0)} session · ${formatTime(clock.allNotes[path] || 0)} all time`
      : "The session timer still works without a note.");
    const map = clock.notesFor(this.scope);
    if (force || (path && map[path] > 0 && !this.rows.has(path))) {
      this.rebuildRows(map, path);
    } else if (path && this.rows.has(path)) {
      // Only this note's total changes during a normal tick. Move it upward
      // if it overtakes another note, without sorting or scanning all notes.
      setTextIfChanged(this.rows.get(path).time, formatTime(map[path]));
      let index = this.positions.get(path);
      while (index > 0 && map[path] > map[this.rankedPaths[index - 1]]) {
        const previous = this.rankedPaths[index - 1];
        this.rankedPaths[index] = previous;
        this.positions.set(previous, index);
        this.rows.get(previous).el.style.order = String(index);
        index -= 1;
      }
      if (index !== this.positions.get(path)) {
        this.rankedPaths[index] = path;
        this.positions.set(path, index);
        this.rows.get(path).el.style.order = String(index);
      }
    }
    const footer = this.scope === "day" ? "Today · Local time · Reset keeps these totals"
      : this.scope === "week" ? "Monday–Sunday · Local time · Reset keeps these totals"
      : this.scope === "session" && clock.unassignedMs >= 1000
      ? `${formatTime(clock.unassignedMs)} without a note · Reset keeps all-time totals`
      : "Saved automatically · Reset keeps all-time totals";
    setTextIfChanged(this.footerEl, footer);
  }

  rebuildRows(map, path) {
    const entries = Object.entries(map).filter(([, ms]) => ms > 0).sort((a, b) => b[1] - a[1]);
    this.rankedPaths = entries.map(([name]) => name);
    this.positions = new Map(this.rankedPaths.map((name, index) => [name, index]));
    const keep = new Set(entries.map(([name]) => name));
    for (const [name, row] of this.rows) {
      if (!keep.has(name)) { row.el.remove(); this.rows.delete(name); }
    }
    entries.forEach(([name, ms], index) => {
      let row = this.rows.get(name);
      if (!row) {
        const el = this.listEl.createDiv({ cls: "ns-note-row" });
        const button = el.createEl("button", { cls: "ns-note-link" });
        button.setText(name.replace(/\.md$/, ""));
        button.title = name;
        button.onclick = async () => {
          const file = this.app.vault.getAbstractFileByPath(name);
          if (!(file instanceof TFile)) return;
          try { await this.app.workspace.getLeaf(false).openFile(file); }
          catch { new Notice("This note could not be opened."); }
        };
        row = { el, button, time: el.createSpan({ cls: "ns-row-time" }) };
        this.rows.set(name, row);
      }
      row.el.style.order = String(index);
      row.el.classList.toggle("is-current", name === path);
      const exists = this.app.vault.getAbstractFileByPath(name) instanceof TFile;
      row.button.disabled = !exists;
      row.button.title = exists ? name : `${name} (deleted or unavailable; saved time retained)`;
      setTextIfChanged(row.time, formatTime(ms));
    });
    this.emptyEl.hidden = entries.length > 0;
    setTextIfChanged(this.emptyEl, "Open a note and press Start.");
  }

  async onClose() {
    this.plugin.views.delete(this);
    this.contentEl.empty();
    this.rows.clear();
    this.plugin.updateCalendarWakeup();
  }
}
