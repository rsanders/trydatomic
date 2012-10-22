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

(defn make-query-form [query]
  `(dbutil/run-query '~query ~'conn) 
  )

(defn eval-query [query sbox]
  (let [form (make-query-form query)]
    (with-open [out (StringWriter.)]
      (let [result (sbox form {#'*out* out})]
        {:expr query
         :result [out result]}))))

(defn eval-query-string [expr sbox]
  (let [form (binding [*read-eval* false] (read-string expr))]
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