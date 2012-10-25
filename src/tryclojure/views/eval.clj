(ns tryclojure.views.eval
  (:require [noir.core :refer [defpage]]
            [tryclojure.models.eval :refer [eval-request]]
            [noir.response :as resp]))

(defpage [:post "/eval.json"] {:keys [expr jsonp]}
  (let [{:keys [expr result results exprs error message] :as res} (eval-request expr)
        data (if error
               res
               (let [[out res] result]
                 {:expr (pr-str expr)
                  :exprs (vec (map pr-str exprs))
                  :results (vec (map pr-str results))
                  :result (str out (pr-str res))}))]
    
    (if jsonp
      (resp/jsonp jsonp data)
      (resp/json data))))