(defproject trydatomic "0.1.0-SNAPSHOT"
  :description "A simple web-based Datomic REPL for trying out Datomic without having to install it."
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [noir "1.3.0-beta10"]
                 [commons-lang/commons-lang "2.5"]
                 [com.datomic/datomic-free "0.8.3561"
                   :exclusions [org.slf4j/slf4j-nop org.slf4j/slf4j-log4j12]]
                 [ch.qos.logback/logback-classic "1.0.7"]
                 ;; [com.cemerick/drawbridge "0.0.6"]
                 [clojail "1.0.3"]]
  :dev-dependencies [[org.clojure/tools.nrepl "0.2.0-beta10"]]

  ;; build and project structure
  :source-paths ["src/clj"]
  
  ;; see https://github.com/emezeske/lein-cljsbuild/blob/0.2.9/sample.project.clj
  :plugins [[lein-cljsbuild "0.2.9"]]
  :hooks [leiningen.cljsbuild]
  :cljsbuild {
    :builds [{
        ; The path to the top-level ClojureScript source directory:
        :source-path "src/cljs"
        ; The standard ClojureScript compiler options:
        ; (See the ClojureScript compiler documentation for details.)
        :compiler {
          :output-to "resources/public/compiled/main.js"  ; default: main.js in current directory
          :optimizations :whitespace
                   :pretty-print true}}]}
  
  :min-lein-version "2"
  :url "http://trydatomic.herokuapp.com/"
  :jvm-opts ["-Djava.security.policy=example.policy""-Xmx80M"]
  :main tryclojure.server)

;;;
;;; see
;;; https://github.com/technomancy/leiningen/blob/master/sample.project.clj
;;;

