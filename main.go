package main

import (
	"flag"
	"fmt"
	"net/http"

	"github.com/anilkusc/QuPoll/database"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

var (
	username = flag.String("username", "admin", "Initial username(default:admin)")
	password = flag.String("password", "admin", "Initial password(default:admin)")
	db       = flag.String("database", "test.db", "Initial database address(default:test.db)")
	port     = flag.String("port", "8080", "Specifiy Port(default:8080)")
	logs     = flag.Bool("logs", false, "Enable or disable Logging(Authn(default:false)")
	https    = flag.Bool("https", false, "Enable or disable https(default:false)")
	key      = []byte("super-secret-key-4")
	store    = sessions.NewCookieStore(key)
)

func Init() {
	flag.Parse()
	database.InitDB(*db, *username, *password)
}

func main() {
	Init()
	r := mux.NewRouter()
	r.HandleFunc("/backend/Login", Login).Methods("POST")
	r.HandleFunc("/backend/Logout", Logout).Methods("POST")
	r.HandleFunc("/backend/AskQuestion", AskQuestion).Methods("POST")
	r.HandleFunc("/backend/GetQuestions", GetQuestions).Methods("POST")
	r.HandleFunc("/backend/LikeQuestion", LikeQuestion).Methods("POST")

	fmt.Println("Serving on:8080")
	if *https == true {
		http.ListenAndServeTLS(":"+*port, "./certs/server.crt", "./certs/server.key", r)
	} else {
		http.ListenAndServe(":"+*port, r)
	}

}
