
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
    sendbuffer: sendbuffer,

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

    handleResult: function(result) { alert(result); },
    handleError:  function(error)  { alert(error); }
}

$(document).ready(function() {
    var myCodeMirror = CodeMirror(document.getElementById('console'), {
      value: "",
      mode:  "clojure",
      lineNumbers: true,
      keyMap: "trydatomic",
      fixedGutter: true,
      extraKeys: {
        // "Ctrl-Enter": function(cm) { TryDatomic.sendbuffer(cm); } 
      }
  });
});
