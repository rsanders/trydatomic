(ns tryclojure.models.datalog
  (:require [clojail.testers :refer [secure-tester-without-def blanket]]
            [clojail.core :refer [sandbox]]
            [clojure.stacktrace :refer [root-cause]]
            [tryclojure.models.eval :as eval]
            [webcli.util.db :as db]
            [noir.session :as session])
  (:use [datomic.api :only [db q] :as d])
  (:import java.io.StringWriter
     java.util.concurrent.TimeoutException))

;; see https://gist.github.com/3132207

(defn log [& args]
  (.info (org.slf4j.LoggerFactory/getLogger "datalog") (apply str args)))

(defn split-query [query]
  (log "presplit query is " query)
  (if (= :find (first (first query)))
    [(first query) (rest query)]
    [(first (first query)) (rest (first query))]))

(defn make-query-form [query]
  (let [[findexpr otherargs] (split-query query)]
    `(dbutil/run-query '~findexpr ~'conn '~otherargs)
  ))

(defn eval-query [query sbox]
  (let [form (make-query-form query)]
    (with-open [out (StringWriter.)]
      (let [result (sbox form {#'*out* out})]
        {:expr query
         :result [out result]}))))

(defn eval-query-string [expr sbox]
  (let [form (binding [*read-eval* false] (read-string (str "[" expr "]")))]
    (eval-query form sbox)))

(defn get-conn []
  (session/get "sb"))

(defn eval-request [expr]
  (try
    (eval-query-string expr (get (session/swap! eval/find-sb) "sb"))
    (catch TimeoutException _
      {:error true :message "Execution Timed Out!"})
    (catch Exception e
      {:error true :message (str (root-cause e))})))