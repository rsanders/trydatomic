(ns tryclojure.views.datalog
  (:require [noir.core :refer [defpage]]
            [tryclojure.models.datalog :refer [eval-query-request eval-transact-request]]
            [noir.session :as session]
            [noir.response :as resp]))

(defpage "/query.json" {:keys [expr jsonp]}
  (let [{:keys [expr result error message] :as res} (eval-query-request expr)
        data (if error
               res
               (let [[out res] result]
                 {:expr (pr-str expr)
                  :result (str out (pr-str res))}))]
    
    (if jsonp
      (resp/jsonp jsonp data)
      (resp/json data))))

(defpage [:post "/transact.json"] {:keys [expr jsonp]}
  (let [{:keys [expr result error message] :as res} (eval-transact-request expr)
        data (if error
               res
               (let [[out res] result]
                 {:expr (pr-str expr)
                  :result (str out (pr-str res))}))]

    (if jsonp
      (resp/jsonp jsonp data)
      (resp/json data))))
