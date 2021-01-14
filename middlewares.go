package main

import (
	"net/http"
)

func Authz(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, _ := store.Get(r, "session-name")
		if session.Values["authenticated"] != "true" {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		} else {
			next(w, r)
		}

	}
}
