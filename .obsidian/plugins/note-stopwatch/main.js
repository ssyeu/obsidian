const { Plugin, Notice, ItemView } = require("obsidian");

module.exports = class NoteStopwatch extends Plugin {
      async onOpen() {
    this.contentEl.empty();

    this.startedAt = Date.now();
    this.timerEl = this.contentEl.createEl("h2", {
      text: "00:00:00"
    });

    this.registerInterval(
      window.setInterval(() => {
        const seconds = Math.floor(
          (Date.now() - this.startedAt) / 1000
        );

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        this.timerEl.setText(
          [hours, minutes, remainingSeconds]
            .map(number => String(number).padStart(2, "0"))
            .join(":")
        );
      }, 250)
    );
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