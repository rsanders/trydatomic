(ns tryclojure.server
  (:require [noir.server :as server]
            [ring.middleware.file :refer [wrap-file]]))

(server/load-views "src/clj/tryclojure/views")

(defn to-port [s]
  (when-let [port s] (Long. port)))

(defn tryclj [& [port]]
  (server/start
   (or (to-port port)
       (to-port (System/getenv "PORT")) ;; For deploying to Heroku
       8801)
   {:session-cookie-attrs {:max-age 600}
    :resource-root "resources/public"
    :resource-options {:root "resources/public"}}))

(defn -main [& args] (tryclj (first args)))