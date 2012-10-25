
if(!String.prototype.trim) {  
  String.prototype.trim = function () {  
    return this.replace(/^\s+|\s+$/g,'');  
  };  
}

function ReplEditor(e) {
  this.editor = e;
  this.historyEnabled = false;
  this.replHist = [];
  this.clearHistory();
}

ReplEditor.prototype.store = function() {
  var e = this.editor;
  var b = e.getValue();
  var s = e.getSelection();
  b = b.trim();
  s = s.trim();
  var text = (s == "") ? b : s;

  if (text == "")
    return null;     // nothing to do

  if (this.historyEnabled) {      
      this.replHist [this.nextHistNdx++] = text;
      this.ndxHist = this.nextHistNdx; // history pointer past freshest item
      if (this.ndxHist > 1) {
          if (this.replHist[this.ndxHist-1] == this.replHist[this.ndxHist-2]) {
              // do not polute history with the same buffer values
              this.ndxHist--;
              this.nextHistNdx--;
          }
      }
  }
  return text;
};


ReplEditor.prototype.bufferEnd = function(e) {
  e.setSelection(
  {
    line: e.lineCount()-1
  }, null,!0);
};

ReplEditor.prototype.appendBuffer = function(e, s) {
  bufferEnd(e);
  e.replaceSelection(s);
  this.bufferEnd(e);
};

ReplEditor.prototype.restoreBuffer = function(e, b) {
  b = b.trim();
  e.setValue(b);
  this.bufferEnd(e); // restore cursor at the end of last line
};

ReplEditor.prototype.histBack = function(e) {
  if (!this.historyEnabled) return;
  if (this.ndxHist > 0) {
    if (this.ndxHist == this.nextHistNdx) {
      var b = e.getValue();
      b = b.trim();
      if (b != "") {
        // preserve current buffer if not empty
        this.replHist[this.nextHistNdx++] = b;
      }
    }
    this.ndxHist--;
    if (this.ndxHist < this.nextHistNdx) {
      var b = this.replHist[this.ndxHist];
      this.restoreBuffer(e,b);
    }
  }
};

ReplEditor.prototype.histFwd = function(e) {
  if (!this.historyEnabled) return;
  if (this.ndxHist < this.nextHistNdx) {
    this.ndxHist++;
    if (this.ndxHist < this.nextHistNdx) {
      var b = this.replHist[this.ndxHist];
      this.restoreBuffer(e,b);
    } else
      e.setValue("");
  }
};

ReplEditor.prototype.clearEditor = function(e) {
  this.ndxHist = this.nextHistNdx;
  e.setValue("");
};

ReplEditor.prototype.clearHistory = function(e) {
  this.replHist = [];
  this.ndxHist = this.nextHistNdx = 0;
};

// you must call this before using any history calls
ReplEditor.prototype.enableHistory = function(e) {
  this.historyEnabled = true;
  this.clearHistory();    
  var me = this;
  CodeMirror.keyMap.trydatomic["Ctrl-Up"]    = function(e) { me.histBack(e) };
  CodeMirror.keyMap.trydatomic["Ctrl-Down"]  = function(e) { me.histFwd(e) };
  CodeMirror.keyMap.trydatomic["Ctrl-Home"]  = function(e) { me.clearEditor(e) };
  CodeMirror.keyMap.trydatomic["Ctrl-End"]   = function(e) { me.clearHistory(e) };
};



