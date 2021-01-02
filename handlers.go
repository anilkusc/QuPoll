package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/anilkusc/QuPoll/database"
	"github.com/anilkusc/QuPoll/models"
)

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	session, _ := store.Get(r, "session-name")
	var user models.User
	var controlUser []models.User
	auth := models.Auth{
		Authenticated: false}
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Println("Error decoding json")
		io.WriteString(w, `{"authenticated":"false"}`)
		return
	}
	controlUser, err = database.ReadUsers(user)
	if err != nil {
		log.Println("Error reading database")
		io.WriteString(w, `{"authenticated":"false"}`)
		return
	}
	if controlUser != nil {
		if controlUser[0].Username == user.Username && controlUser[0].Password == user.Password {
			auth.User = controlUser[0]
			auth.Authenticated = true
			returnValue, err := json.Marshal(auth)
			if err != nil {
				log.Println("Error marsahll json ")
				io.WriteString(w, `{"authenticated":"false"}`)
				return
			}
			session.Values["authenticated"] = "true"
			session.Values["role"] = auth.User.Role
			session.Save(r, w)
			io.WriteString(w, string(returnValue))
			return
		} else {
			returnValue, err := json.Marshal(auth)
			if err != nil {
				log.Println("Error marshall json ")
				io.WriteString(w, `{"authenticated":"false"}`)
				return
			}
			io.WriteString(w, string(returnValue))
			return
		}
	} else {
		returnValue, err := json.Marshal(auth)
		if err != nil {
			log.Println("Error marsahll json ")
			io.WriteString(w, `{"authenticated":"false"}`)
			return
		}
		io.WriteString(w, string(returnValue))
		return
	}
}
func Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	session, _ := store.Get(r, "session-name")
	session.Values["authenticated"] = "false"
	session.Values["role"] = ""
	session.Save(r, w)
	io.WriteString(w, `{"authenticated":"false"}`)
	return

}
func AskQuestion(w http.ResponseWriter, r *http.Request) {
	var question models.Question
	err := json.NewDecoder(r.Body).Decode(&question)
	if err != nil {
		log.Println("Error decoding json on AskQuestion")
		io.WriteString(w, `Error decoding json on AskQuestion`)
		return
	}
	now := time.Now()
	question.Date = now.Format("2006-01-02 15:04")
	createdQuestion, err := database.CreateQuestion(question)
	if err != nil {
		log.Println("Error writing question to database")
		io.WriteString(w, `Error writing question to database`)
		return
	}
	returnValue, err := json.Marshal(createdQuestion)
	if err != nil {
		log.Println("Error marshalling the question")
		io.WriteString(w, `Error marshalling the question`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func GetQuestions(w http.ResponseWriter, r *http.Request) {
	questions, err := database.ReadQuestions()
	if err != nil {
		log.Println("Error getting questions from database")
		io.WriteString(w, `Error getting questions from database`)
		return
	}
	returnValue, err := json.Marshal(questions)
	if err != nil {
		log.Println("Error marshalling questions")
		io.WriteString(w, `Error marshalling questions`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func LikeQuestion(w http.ResponseWriter, r *http.Request) {
	var question models.Question
	err := json.NewDecoder(r.Body).Decode(&question)
	if err != nil {
		log.Println("Error decoding json on LikeQuestion")
		io.WriteString(w, `Error decoding json on LikeQuestion`)
		return
	}
	willBeUpdatedQuestion, err := database.ReadQuestions(question)
	if err != nil {
		log.Println("Error getting question from database")
		io.WriteString(w, `Error getting question from database`)
		return
	}
	willBeUpdatedQuestion[0].LikeCount = willBeUpdatedQuestion[0].LikeCount + 1

	updatedQuestion, err := database.UpdateQuestion(willBeUpdatedQuestion[0])
	if err != nil {
		log.Println("Error updating question on database")
		io.WriteString(w, `Error updating question on database`)
		return
	}
	returnValue, err := json.Marshal(updatedQuestion)
	if err != nil {
		log.Println("Error marshalling the question")
		io.WriteString(w, `Error marshalling the question`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
