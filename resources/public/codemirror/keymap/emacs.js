// TODO number prefixes
(function() {
  // Really primitive kill-ring implementation.
  var killRing = [];
  function addToRing(str) {
    killRing.push(str);
    if (killRing.length > 50) killRing.shift();
  }
  function getFromRing() { return killRing[killRing.length - 1] || ""; }
  function popFromRing() { if (killRing.length > 1) killRing.pop(); return getFromRing(); }

  function clearSelection(cm) {
      var cur = cm.getCursor();
      cm.setSelectionMark(null);
      cm.setSelection(cur, cur);
  }

  function moveRestOfLineDown(cm) {
    var cur = cm.getCursor();
    cm.replaceRange("\n", cur);
    var spc = "";
    for (var i = 0; i < cur.ch; i++) { spc += " ";}
    cm.replaceRange(spc, cm.getCursor());
    cm.setCursor(cur);
  }

  CodeMirror.keyMap.emacs = {
    "Ctrl-X": function(cm) {cm.setOption("keyMap", "emacs-Ctrl-X");},
    "Ctrl-W": function(cm) {addToRing(cm.getSelection()); cm.replaceSelection("");},
    "Ctrl-Alt-W": function(cm) {addToRing(cm.getSelection()); cm.replaceSelection("");},
    "Alt-W": function(cm) {addToRing(cm.getSelection()); clearSelection(cm); },
    "Ctrl-Y": function(cm) {cm.replaceSelection(getFromRing());},
    "Alt-Y": function(cm) {cm.replaceSelection(popFromRing());},
    "Ctrl-/": "undo", "Shift-Ctrl--": "undo", "Shift-Alt-,": "goDocStart", "Shift-Alt-.": "goDocEnd",
    "Ctrl-S": "findNext", "Ctrl-R": "findPrev", "Ctrl-G": "clearSearch", "Shift-Alt-5": "replace",
    "Ctrl-Z": "undo", "Cmd-Z": "undo", "Alt-/": "autocomplete",
    "Alt-<": "goDocStart", "Alt->": "goDocEnd",
    "Ctrl-O": function(cm) {cm.replaceRange("\n", cm.getCursor());},
    "Ctrl-Alt-O": moveRestOfLineDown,
    fallthrough: ["basic", "emacsy"]
  };

  CodeMirror.keyMap["emacs-Ctrl-X"] = {
    "Ctrl-S": "save", "Ctrl-W": "save", "S": "saveAll", "F": "open", "U": "undo", "K": "close",
    "H": "selectAll",
    auto: "emacs", nofallthrough: true
  };
})();

/*
  keyMap.macDefault = {
    "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
    "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goWordLeft",
    "Alt-Right": "goWordRight", "Cmd-Left": "goLineStart", "Cmd-Right": "goLineEnd", "Alt-Backspace": "delWordBefore",
    "Ctrl-Alt-Backspace": "delWordAfter", "Alt-Delete": "delWordAfter", "Cmd-S": "save", "Cmd-F": "find",
    "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
    "Cmd-[": "indentLess", "Cmd-]": "indentMore",
  };
  keyMap.emacsy = {
    "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
    "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
    "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageDown", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",
    "Alt-V": "goPageUp",
    "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars"
  };
*/
