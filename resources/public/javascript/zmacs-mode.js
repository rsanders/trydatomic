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
     this.editor.setOption('onCursorActivity', function(cm, key) { 
                               setTimeout(function() { me.onCursorActivity(cm, key); }, 0);
                           });
 };

 ZmacsMode.prototype.setMark = function(cm) {
     var cursor = this.editor.getCursor();
     this.mark = this.editor.setBookmark(cursor);
     console.log("Set Mark at " + pos2str(cursor) + ", mark=" + this.mark);
     this.scheduleDisplayUpdate();
 };

 ZmacsMode.prototype.clearMark = function(cm) {
     console.log("Clear Mark!");
     
     if (this.mark) {
         this.mark.clear();
         this.mark = null;
     }
     if (this.editor.somethingSelected()) {
         var cur = this.editor.getCursor();
         this.editor.setSelection(cur, cur);
     }
     this.scheduleDisplayUpdate();
 };

 var pos2str = function(pos) {
     return "{line: " + pos.line + " ch: " + pos.ch + "}"
 }

 ZmacsMode.prototype.setSelection = function(mark, point) {
     var e = this.editor;
     console.log("setting selection to " + pos2str(mark) + " e=" + pos2str(point));
     var markPos = e.indexFromPos(mark);
     var pointPos = e.indexFromPos(point);
     if (markPos == pointPos) return;
     var dir = (markPos > pointPos) ? -1 : 1;
     pointPos += dir;

     e.setSelection(e.posFromIndex(markPos), e.posFromIndex(pointPos));
 };

 ZmacsMode.prototype.updateDisplay = function() {
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
     setTimeout(function() { me.inHook -= 1; }, 0);
 };

 ZmacsMode.prototype.onChange = function(e, changelist) {
     if (this.inHook > 0) return;
     if (this.mark) {
         this.enterHook();
         console.log("onchange!");
         this.clearMark();
         this.updateDisplay();
         this.exitHook();
     }
 };

 ZmacsMode.prototype.onCursorActivity = function(e) {
     if (this.inHook > 0) return;
     if (this.mark) {
         this.enterHook();
         console.log("cursor activity!");
         this.updateDisplay();        
         this.exitHook();
     }
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
