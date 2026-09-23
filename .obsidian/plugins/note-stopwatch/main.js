const { Plugin, Notice, ItemView } = require("obsidian");

module.exports = class NoteStopwatch extends Plugin {
    onload() {
    this.registerView(
      "note-stopwatch-view",
      (leaf) => new StopwatchView(leaf)
    );

    this.addRibbonIcon("timer", "Open stopwatch", async () => {
      let leaf = this.app.workspace
        .getLeavesOfType("note-stopwatch-view")[0];

      if (!leaf) {
        leaf = this.app.workspace.getLeftLeaf(true);
        if (!leaf) return;

        await leaf.setViewState({
          type: "note-stopwatch-view"
        });
      }

      await this.app.workspace.revealLeaf(leaf);
    });
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