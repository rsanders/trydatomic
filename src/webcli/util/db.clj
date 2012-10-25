(ns webcli.util.db
  (:use [datomic.api :only [db q transact] :as d])
  (:import java.io.StringWriter
	   java.util.concurrent.TimeoutException))

(defn make-tmpname []
  (gensym "trydb"))

(def ^:dynamic *dbname* (atom (make-tmpname)))
(def ^:dynamic *conn*   (atom nil))

(defn get-connection []
  @*conn*)

(defn create-sample-database [name]
  (let [uri (str "datomic:mem://" name)]
    (d/create-database uri)
    (let [conn (d/connect uri)
          schema (read-string (slurp "resources/public/samples/seattle/seattle-schema.dtm"))
          data   (read-string (slurp "resources/public/samples/seattle/seattle-data0.dtm"))]
      @(d/transact conn schema)
      @(d/transact conn data)
      conn)))

(defn delete-database []
  (when @*conn*
    (datomic.api/delete-database (str "datomic:mem://" @*dbname*))))

(defn reset-database []
  (if @*conn*
    (delete-database))
  (reset! *dbname* (make-tmpname))
  (reset! *conn* (create-sample-database @*dbname*)))

(defn log [string]
  (.debug (org.slf4j.LoggerFactory/getLogger "db") string))

(defn connection-or-default [conn]
  (if conn
    conn
    (get-connection)))

(defn run-query [query conno otherargs] 
  (let [conn (connection-or-default conno)
        results (apply d/q (concat (list query (d/db conn)) otherargs))]
    (println "Found" (count results) "results")
    (doseq [x results] (println x))))

(defn run-transact [query conno] 
  (let [conn (connection-or-default conno)
        result-future (transact conn query)
        result        @result-future]
    (doseq [x (:tx-data result)] (println x))))
