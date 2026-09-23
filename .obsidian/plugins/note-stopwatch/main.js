const { Plugin, Notice, ItemView } = require("obsidian");

module.exports = class NoteStopwatch extends Plugin {
  onload() {
    new Notice("Note Stopwatch loaded!");
  }
};

class StopwatchView extends ItemView {
  getViewType() {
    return "note-stopwatch-view";
  }

  getDisplayText() {
    return "Stopwatch";
  }

  getIcon() {
    return "timer";
  }

  async onOpen() {
    this.contentEl.empty();
    this.contentEl.createEl("h2", { text: "00:00:00" });
  }
}