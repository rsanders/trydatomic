(ns webcli.util.db
  (:use [datomic.api :only [db q] :as d])
  (:import java.io.StringWriter
	   java.util.concurrent.TimeoutException))

(defn create-sample-database [name]
  (let [uri (str "datomic:mem://" name)]
    (d/create-database uri)
    (let [conn (d/connect uri)
          schema (read-string (slurp "resources/public/samples/seattle/seattle-schema.dtm"))
          data (read-string (slurp "resources/public/samples/seattle/seattle-data0.dtm"))]
      @(d/transact conn schema)
      @(d/transact conn data)
      conn)))

(defn log [string]
  (.debug (org.slf4j.LoggerFactory/getLogger "db") string))

(defn run-query [query conn otherargs] 
  (let [results (apply d/q (concat (list query (d/db conn)) otherargs))]
    (println "Found" (count results) "results")
    (doseq [x results] (println x))))
