(function () {
 ZmacsMode = function(cm) {
     var me = this;
     this.editor = cm;
     this.mark = null;
     this.inHook = 0;
     
     this.reset();
     this.editor.setOption('onChange', function(cm, changelist) { 
                               setTimeout(function() { me.onChange(cm, changelist); }, 50);
                           });
     //this.editor.setOption('onCursorActivity', function(cm, key) { 
     //                          setTimeout(function() { me.onCursorActivity(cm, key); }, 50);
     //                      });
 };

 ZmacsMode.prototype.setMark = function(cm) {
     var cursor = this.editor.getCursor();
     console.log("Set Mark at " + pos2str(cursor) + ", mark=" + this.mark);
     this.editor.setSelectionMark(cursor);
 };

 ZmacsMode.prototype.clearMark = function(cm) {
     console.log("Clear Mark!");
     this.editor.setSelectionMark(null);
     if (this.editor.somethingSelected() || true) {
         var cur = this.editor.getCursor();
         this.editor.setSelection(cur, cur);
     }
 };

 var pos2str = function(pos) {
     return "{line: " + pos.line + " ch: " + pos.ch + "}"
 }

 ZmacsMode.prototype.setSelection = function(mark, point) {
     var e = this.editor;
     console.log("setting selection to " + pos2str(mark) + " e=" + pos2str(point));
     console.log("..old point was " + pos2str(this.editor.getCursor()));
     var markPos = e.indexFromPos(mark);
     var pointPos = e.indexFromPos(point);
     if (markPos == pointPos) return;
     var dir = (markPos > pointPos) ? -1 : 1;
     // pointPos += dir;

     // e.setSelection(e.posFromIndex(markPos), e.posFromIndex(pointPos), true);
     e.setSelection(mark, point, true);
     e.setCursor(point.line, point.ch, true);
     console.log("..new point is " + pos2str(this.editor.getCursor()));
 };

 ZmacsMode.prototype.updateDisplay = function() {
     return;
     console.log("updating display");
     if (this.mark) {
         var mark = this.mark.find();
         var point = this.editor.getCursor();
         if (mark) {
             this.setSelection(mark, point);
         } else {
             return this.clearMark();
         }
     }
 };

 ZmacsMode.prototype.enterHook = function() {
     this.inHook += 1;
 };

 ZmacsMode.prototype.exitHook = function() {
     var me = this;
     setTimeout(function() { me.inHook -= 1; }, 100);
 };

 ZmacsMode.prototype.onChange = function(e, changelist) {
     this.clearMark();
 };

 ZmacsMode.prototype.scheduleDisplayUpdate = function() {
     var me = this;
     setTimeout(function() { me.updateDisplay(); }, 20);
 };

 // you must call this before using any history calls
 ZmacsMode.prototype.reset = function(e) {
     this.markSet = false;
     this.updateDisplay();    
     var me = this;
     CodeMirror.keyMap.emacs["Ctrl-Space"]  = function(e) { me.setMark(e) };
     CodeMirror.keyMap.emacs["Ctrl-G"]      = function(e) { me.clearMark(e) };
 };

 ZmacsMode.install = function(e) {
     e.zmacs_mode = new ZmacsMode(e);
 };
})();
