
(function() {

  CodeMirror.keyMap.trydatomic = {
    "Ctrl-Enter": function(cm) { 
      TryDatomic.doQuery(cm); 
      cm.setSelection({line: 0, ch: 0}, {line: 0, ch: 0});
    },
    "Ctrl-Up":    function(e) { TryDatomic.repl.histBack(e) },
    "Ctrl-Down":  function(e) { TryDatomic.repl.histFwd(e) },
    fallthrough: ["emacs", "basic", "emacsy"]
  };
  CodeMirror.keyMap["emacs-Ctrl-X"]["Ctrl-E"] = function(cm) {
    TryDatomic.doQuery(cm);
  };
  CodeMirror.keyMap["emacs-Ctrl-X"]["Ctrl-P"] = function(cm) {
      TryDatomic.repl.histBack(cm);
  };
  CodeMirror.keyMap["emacs-Ctrl-X"]["Ctrl-N"] = function(cm) {
      TryDatomic.repl.histFwd(cm);
  };
})();
