const { Plugin, Notice } = require("obsidian");

module.exports = class NoteStopwatch extends Plugin {
  onload() {
    new Notice("Note Stopwatch loaded!");
  }
};
