
function sendbuffer(cm) {
    // take either the selection or the entire buffer
    var input = cm.getSelection();
    if (input == null || $.trim(input) == '') {
        input = cm.getValue();
    }

    TryDatomic.sendQuery(input);
    return false;
}


var TryDatomic = {
    sendbuffer: function() {
        this.sendQuery(this.getEditorSelection());
    },

    sendQuery:    function(query)  {
        // perform evaluation
        var data = this.eval_query(query);

        // handle error
        if (data.error) {
            this.handleError(data.message);
            return;
        }

        this.handleResult(data.result);
    },

    getEditorSelection: function(cm) {
        cm = cm || this.editor;
        // take either the selection or the entire buffer
        var input = cm.getSelection();
        if (input == null || $.trim(input) == '') {
            input = cm.getValue();
        }

        return input;
    },

    eval_query: function(code) {
        var data;
        $.ajax({
                   url: "query.json",
                   data: { expr : code },
                   async: false,
                   success: function(res) { data = res; }
               });
        return data;
    },

    handleResult: function(result) {
        this.resultsbox.setValue(result);
    },
    handleError:  function(error)  {
        this.resultsbox.setValue(error);
    }
}

$(document).ready(function() {
    TryDatomic.editor = CodeMirror.fromTextArea(document.getElementById('userinput'), {
      value: "",
      mode:  "clojure",
      lineNumbers: true,
      keyMap: "trydatomic",
      fixedGutter: true,
      extraKeys: {
        // "Ctrl-Enter": function(cm) { TryDatomic.sendbuffer(cm); } 
      }
  });
  $('.userinput .CodeMirror-scroll').height('500px');
  TryDatomic.resultsbox = CodeMirror.fromTextArea(document.getElementById('result'), {
      value: "",
      mode:  "clojure",
      lineNumbers: true,
      keyMap: "trydatomic",
      fixedGutter: true,
      readOnly: true,
  });
  $('.result .CodeMirror-scroll').height('600px');

  // setup buttons
  $('#btn_query').click(function() {
    TryDatomic.sendbuffer(TryDatomic.editor);
  });
});
