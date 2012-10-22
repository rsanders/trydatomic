(ns tryclojure.views.cm
  (:require [noir.core :refer [defpartial defpage]]
            [hiccup.element :refer [javascript-tag link-to unordered-list]]
            [hiccup.page :refer [include-css include-js html5]]))

(defpartial links []
  (unordered-list
   [(link-to "http://clojure.org" "The official Clojure website")
    (link-to "http://datomic.com" "The official Datomic website") 
    (link-to "http://dev.clojure.org/display/doc/Getting+Started" "Getting started with Clojure")
    (link-to "http://groups.google.com/group/datomic" "Clojure mailing list")
    (link-to "http://java.ociweb.com/mark/clojure/article.html" "A comprehensive Clojure tutorial")
    (link-to "http://joyofclojure.com/" "The Joy of Clojure: a book by Michael Fogus and Chris Houser")
    (link-to "http://disclojure.org" "Disclojure")
    (link-to "http://planet.clojure.in" "Planet Clojure")]))

(defpartial about-html []
  [:p.bottom
   "Please note that this REPL is sandboxed, so you wont be able to do everything in it "
   "that you would in a local unsandboxed REPL. Keep in mind that this site is designed for "
   "beginners to try out Clojure and not necessarily as a general-purpose server-side REPL."]
  [:p.bottom
   "One quirk you might run into is that things you bind with def can sometimes disappear. "
   "The sandbox wipes defs if you def too many things, so don't be surprised. Furthermore, "
   "The sandbox will automatically be wiped after 15 minutes and if you evaluate more after that,"
   "It'll be in an entirely new namespace/sandbox."]
  [:p.bottom
   "You can find the site's source and such on its "
   (link-to "http://github.com/Raynes/tryclojure" "github")
   " page."]
  [:p.bottom
   "TryClojure is written in Clojure and JavaScript (JQuery), powered by "
   (link-to "https://github.com/flatland/clojail" "clojail")
   " and Chris Done's "
   (link-to "https://github.com/chrisdone/jquery-console" "jquery-console")]
  [:p.bottom "Design by " (link-to "http://apgwoz.com" "Andrew Gwozdziewycz")])

(defpartial home-html []
  [:p.bottom
   "Welcome to Try Clojure. See that little box up there? That's a Clojure repl. You can type "
   "expressions and see their results right here in your browser. We also have a brief tutorial to "
   "give you a taste of Clojure. Try it out by typing " [:code.expr "tutorial"] " in the console!"]
  [:p.bottom
   "Check out the site's source on "
   (link-to "http://github.com/Raynes/tryclojure" "github")
   "!"])

(defn root-html []
  (html5
   [:head
    (include-css "/codemirror/lib/codemirror.css"
                 "/css/tryclojure.css")
    (include-js "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"
                "/javascript/jquery-console/jquery.console.js"
                "/codemirror/lib/codemirror.js"
                "/codemirror/keymap/emacs.js"
                "/codemirror/mode/clojure/clojure.js"
                "/javascript/trydatomic.js")
    [:title "Try Clojure"]]
   [:body
    [:div#wrapper
     [:div#content
      [:div#header
       [:h1
        [:span.logo-try "Try"] " "
        [:span.logo-clojure "Datomic"]]]
      [:div#container
       [:div#console.console]
       [:div#buttons
        [:a#home.buttons "home"]
        [:a#links.buttons "links"]
        [:a#about.buttons.last "about"]]
       [:div#changer (home-html)]]
      [:div.footer
       [:p.bottom "©2011 Anthony Grimes and numerous contributors"]
       [:p.bottom
        "Built with "
        (link-to "http://webnoir.org" "Noir")
        "."]]
      ; (javascript-tag
      ;  "var _gaq = _gaq || [];
      ;   _gaq.push(['_setAccount', 'UA-27340918-1']);
      ;   _gaq.push(['_trackPageview']);

      ;   (function() {
      ;     var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ;     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      ;     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      ;   })();")
      ]]]))

(defpage "/cm" []
  (root-html))

