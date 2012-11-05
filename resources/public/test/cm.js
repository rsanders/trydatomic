TryDatomic = {};

$(document).ready(
    function() {
        TryDatomic.editor = CodeMirror.fromTextArea(document.getElementById('userinput'), {
                                                        value: "",
                                                        mode:  "clojure",
                                                        lineNumbers: true,
                                                        keyMap: "emacs",
                                                        fixedGutter: true,
                                                        matchBrackets: true,
                                                        lineWrapping: true,
                                                        autofocus: true,
                                                        theme: 'datomicblue',
                                                        extraKeys: {
                                                         "Tab": "indentAuto",
                                                        }
                                                    });

        ZmacsMode.install(TryDatomic.editor);

        $('.userinput .CodeMirror').height('500px');
    });
