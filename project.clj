(defproject trydatomic "0.1.0-SNAPSHOT"
  :description "A simple web-based Datomic REPL for trying out Datomic without having to install it."
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [noir "1.3.0-beta10"]
                 [commons-lang/commons-lang "2.5"]
                 [com.datomic/datomic-free "0.8.3551"
                   :exclusions [org.slf4j/slf4j-nop org.slf4j/slf4j-log4j12]]
                 [ch.qos.logback/logback-classic "1.0.1"]
                 [org.clojure/tools.nrepl "0.2.0-beta10"]
                 ;; [com.cemerick/drawbridge "0.0.6"]
                 ;; [ringmon "0.1.2"]
                 [clojail "1.0.1"]]
  :min-lein-version "2"
  :url "http://trydatomic.herokuapp.com/"
  :jvm-opts ["-Djava.security.policy=example.policy""-Xmx80M"]
  :main tryclojure.server)


