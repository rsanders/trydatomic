
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
    resetDB: function() {
      this.eval_clojure("(dbutil/reset-database)");
    },

    doEval: function() {
        var text = this.repl.store();
        if (text && text != '') {
            this.sendClojure(text); 
        } else {
            alert("Nothing to send");
        }
    },

    sendClojure:    function(query)  {
        // perform evaluation
        var data = this.eval_clojure(query);

        // handle error
        if (data.error) {
            this.handleError(data.message);
            return;
        }

        var console_out = "", i = 0, len = data.results.length;
        for (i=0; i < len; i++) {
            console_out += ";; " + data.exprs[i] + "\n" + data.results[i] + "\n\n";
        }

        this.handleResult(console_out);
    },

    doQuery: function() {
        var text = this.repl.store();
        if (text && text != '') {
            this.sendClojure(text); 
        } else {
            alert("Nothing to send");
        }
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

    doTransact: function() {
        var text = this.repl.store();
        if (text && text != '') {
            this.sendTransact(text); 
        } else {
            alert("Nothing to send");
        }
    },

    sendTransact:    function(query)  {
        // perform evaluation
        var data = this.eval_transact(query);

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

    eval_transact: function(code) {
        var data;
        $.ajax({
                   url: "transact.json",
                   data: { expr : code },
                   async: false,
                   type: 'post',
                   success: function(res) { data = res; }
               });
        return data;
    },

    eval_clojure: function(code) {
        var data;
        $.ajax({
                   url: "eval.json",
                   data: { expr : code },
                   async: false,
                   type: 'post',
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
};

$(document).ready(
    function() {
        TryDatomic.editor = CodeMirror.fromTextArea(document.getElementById('userinput'), {
                                                        value: "",
                                                        mode:  "clojure",
                                                        lineNumbers: true,
                                                        keyMap: "trydatomic",
                                                        fixedGutter: true,
                                                        matchBrackets: true,
                                                        lineWrapping: true,
                                                        autofocus: true,
                                                        extraKeys: {
                                                         // test    
                                                        }
                                                    });
        TryDatomic.repl = new ReplEditor(TryDatomic.editor);
        TryDatomic.repl.enableHistory();
        ZmacsMode.install(TryDatomic.editor);

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
        
        var trackAction = function(action) {
            _gaq.push(['_trackEvent', 'UI', action, 'buffer']);
        }

        // setup buttons
        $('#btn_query').click(
            function() {
                trackAction('query');
                TryDatomic.doQuery(TryDatomic.editor);
            });
        $('#btn_transact').click(
            function() {
                trackAction('transact');
                TryDatomic.doTransact(TryDatomic.editor);
            });
        $('#btn_resetdb').click(
            function() {
                trackAction('resetdb');
                TryDatomic.resetDB();
            });
        $('#btn_eval').click(
            function() {
                trackAction('eval');
                TryDatomic.doEval(TryDatomic.editor);
            });
    });
