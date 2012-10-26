(function () {
  ZmacsMode = function(cm) {
    var me = this;
    this.editor = cm;
    this.mark = null;
    this.inHook = 0;
    
    this.reset();
    this.editor.setOption('onChange', function(cm, changelist) { 
      setTimeout(function() { me.onChange(cm, changelist); }, 0);
    });
  };

  ZmacsMode.prototype.setMark = function(cm) {
    var cursor = this.editor.getCursor();
    this.editor.setSelectionMark(cursor);
  };
  
  ZmacsMode.prototype.clearMark = function(cm) {
    this.editor.setSelectionMark(null);
    var cur = this.editor.getCursor();
    this.editor.setSelection(cur, cur);
  };

 
  ZmacsMode.prototype.onChange = function(e, changelist) {
    this.clearMark();
  };

  // you must call this before using any history calls
  ZmacsMode.prototype.reset = function(e) {
    this.markSet = false;
    this.editor.setSelectionMark(null);
    var me = this;
    CodeMirror.keyMap.emacs["Ctrl-Space"]  = function(e) { me.setMark(e) };
    CodeMirror.keyMap.emacs["Ctrl-G"]      = function(e) { me.clearMark(e) };
  };

  ZmacsMode.install = function(e) {
    e.zmacs_mode = new ZmacsMode(e);
  };
})();
