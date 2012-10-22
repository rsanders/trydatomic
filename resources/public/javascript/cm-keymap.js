
(function() {

  CodeMirror.keyMap.trydatomic = {
    "Ctrl-Enter": function(cm) { 
      TryDatomic.sendbuffer(cm); 
      cm.setSelection({line: 0, ch: 0}, {line: 0, ch: 0});
    },
    fallthrough: ["emacs", "basic", "emacsy"]
  };
  CodeMirror.keyMap["emacs-Ctrl-X"]["Ctrl-E"] = function(cm) {
    TryDatomic.sendbuffer(cm);
  };

})();
