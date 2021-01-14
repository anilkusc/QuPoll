package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
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
			auth.User.Password = "*********"
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
	_, err = database.CreateQuestion(question)
	if err != nil {
		log.Println("Error writing question to database")
		io.WriteString(w, `Error writing question to database`)
		return
	}
	session := models.Session{Id: question.Session.Id}

	questions, err := database.GetQuestions(session)
	if err != nil {
		log.Println("Cannot Read Questions")
		io.WriteString(w, `Cannot Read Questions`)
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
func GetQuestions(w http.ResponseWriter, r *http.Request) {
	currentSession, _ := store.Get(r, "session-name")
	var session models.Session
	err := json.NewDecoder(r.Body).Decode(&session)
	if err != nil {
		log.Println("Error decoding json on GetQuestions")
		io.WriteString(w, `Error decoding json on GetQuestions`)
		return
	}
	currentSession.Values["session"] = session.Id
	currentSession.Save(r, w)
	questions, err := database.GetQuestions(session)
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

	_, err = database.UpdateQuestion(willBeUpdatedQuestion[0])
	if err != nil {
		log.Println("Error updating question on database")
		io.WriteString(w, `Error updating question on database`)
		return
	}
	var session = models.Session{Id: willBeUpdatedQuestion[0].Session.Id}
	questions, err := database.GetQuestions(session)
	if err != nil {
		log.Println("Cannot Read Questions")
		io.WriteString(w, `Cannot Read Questions`)
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
func UnlikeQuestion(w http.ResponseWriter, r *http.Request) {
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
	willBeUpdatedQuestion[0].LikeCount = willBeUpdatedQuestion[0].LikeCount - 1

	_, err = database.UpdateQuestion(willBeUpdatedQuestion[0])
	if err != nil {
		log.Println("Error updating question on database")
		io.WriteString(w, `Error updating question on database`)
		return
	}
	var session = models.Session{Id: willBeUpdatedQuestion[0].Session.Id}
	questions, err := database.GetQuestions(session)
	if err != nil {
		log.Println("Cannot Read Questions")
		io.WriteString(w, `Cannot Read Questions`)
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
func GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := database.ReadUsers()
	if err != nil {
		log.Println("Error getting users from database")
		io.WriteString(w, `Error getting users from database`)
		return
	}
	for i, _ := range users {
		users[i].Password = "*******"
	}
	returnValue, err := json.Marshal(users)
	if err != nil {
		log.Println("Error marshalling users")
		io.WriteString(w, `Error marshalling users`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	var users []models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Println("Error decoding json on CreateUser")
		io.WriteString(w, `Error decoding json on CreateUser`)
		return
	}
	_, err = database.CreateUser(user)
	if err != nil {
		log.Println("Error writing user to database")
		io.WriteString(w, `Error writing user to database`)
		return
	}
	users, err = database.ReadUsers()
	if err != nil {
		log.Println("Cannot Read Users")
		io.WriteString(w, `Cannot Read Users`)
		return
	}
	returnValue, err := json.Marshal(users)
	if err != nil {
		log.Println("Error marshalling users")
		io.WriteString(w, `Error marshalling users`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	var users []models.User
	err := json.NewDecoder(r.Body).Decode(&users)
	if err != nil {
		log.Println("Error decoding json on DeleteUser")
		io.WriteString(w, `Error decoding json on DeleteUser`)
		return
	}
	_, err = database.DeleteUsers(users)
	if err != nil {
		log.Println("Error writing deleting users")
		io.WriteString(w, `Error writing deleting users`)
		return
	}
	users, err = database.ReadUsers()
	if err != nil {
		log.Println("Cannot Read Users")
		io.WriteString(w, `Cannot Read Users`)
		return
	}
	returnValue, err := json.Marshal(users)
	if err != nil {
		log.Println("Error marshalling users")
		io.WriteString(w, `Error marshalling users`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Println("Error decoding json on UpdateUser")
		io.WriteString(w, `Error decoding json on UpdateUser`)
		return
	}
	if user.Password == "" {
		tempUser, _ := database.ReadUsers(user)
		user.Password = tempUser[0].Password
	}
	_, err = database.UpdateUser(user)
	if err != nil {
		log.Println("Error writing updating users")
		io.WriteString(w, `Error writing updating users`)
		return
	}
	users, err := database.ReadUsers()
	if err != nil {
		log.Println("Cannot Read Users")
		io.WriteString(w, `Cannot Read Users`)
		return
	}
	returnValue, err := json.Marshal(users)
	if err != nil {
		log.Println("Error marshalling users")
		io.WriteString(w, `Error marshalling users`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func GetSessions(w http.ResponseWriter, r *http.Request) {
	sessions, err := database.ReadSessions()
	if err != nil {
		log.Println("Error getting sessions from database")
		io.WriteString(w, `Error getting sessions from database`)
		return
	}
	for i, _ := range sessions {
		sessions[i].Password = "********"
	}
	returnValue, err := json.Marshal(sessions)
	if err != nil {
		log.Println("Error marshalling users")
		io.WriteString(w, `Error marshalling users`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func ChangeSession(w http.ResponseWriter, r *http.Request) {
	var session models.Session
	err := json.NewDecoder(r.Body).Decode(&session)
	if err != nil {
		log.Println("Error decoding json on ChangeSession")
		io.WriteString(w, `Error decoding json on ChangeSession`)
		return
	}

	returnSession, err := database.ChangeSession(session)
	if err != nil {
		log.Println("Error getting sessions from database")
		io.WriteString(w, `Error getting sessions from database`)
		return
	}
	currentSession, _ := store.Get(r, "session-name")
	currentSession.Values["session"] = returnSession.Id
	currentSession.Save(r, w)
	returnValue, err := json.Marshal(returnSession)
	if err != nil {
		log.Println("Error marshalling session")
		io.WriteString(w, `Error marshalling session`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func CreateSession(w http.ResponseWriter, r *http.Request) {
	var session models.Session
	var sessions []models.Session
	err := json.NewDecoder(r.Body).Decode(&session)
	if err != nil {
		log.Println("Error decoding json on CreateSession")
		io.WriteString(w, `Error decoding json on CreateSession`)
		return
	}
	_, err = database.CreateSession(session)
	if err != nil {
		log.Println("Error writing session to database")
		io.WriteString(w, `Error writing session to database`)
		return
	}
	sessions, err = database.ReadSessions()
	if err != nil {
		log.Println("Cannot Read Sessions")
		io.WriteString(w, `Cannot Read Sessions`)
		return
	}
	returnValue, err := json.Marshal(sessions)
	if err != nil {
		log.Println("Error marshalling Sessions")
		io.WriteString(w, `Error marshalling Sessions`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func DeleteSession(w http.ResponseWriter, r *http.Request) {
	var sessions []models.Session
	err := json.NewDecoder(r.Body).Decode(&sessions)
	if err != nil {
		log.Println("Error decoding json on DeleteSession")
		io.WriteString(w, `Error decoding json on DeleteSession`)
		return
	}
	_, err = database.DeleteSessions(sessions)
	if err != nil {
		log.Println("Error writing deleting Sessions")
		io.WriteString(w, `Error writing deleting Sessions`)
		return
	}
	sessions, err = database.ReadSessions()
	if err != nil {
		log.Println("Cannot Read Sessions")
		io.WriteString(w, `Cannot Read Sessions`)
		return
	}
	returnValue, err := json.Marshal(sessions)
	if err != nil {
		log.Println("Error marshalling sessions")
		io.WriteString(w, `Error marshalling sessions`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func UpdateSession(w http.ResponseWriter, r *http.Request) {
	var session models.Session
	err := json.NewDecoder(r.Body).Decode(&session)
	if err != nil {
		log.Println("Error decoding json on UpdateSession")
		io.WriteString(w, `Error decoding json on UpdateSession`)
		return
	}
	if session.Password == "" {
		tempSession, _ := database.ReadSessions(session)
		session.Password = tempSession[0].Password
	}
	_, err = database.UpdateSession(session)
	if err != nil {
		log.Println("Error writing updating sessions")
		io.WriteString(w, `Error writing updating sessions`)
		return
	}
	sessions, err := database.ReadSessions()
	if err != nil {
		log.Println("Cannot Read Sessions")
		io.WriteString(w, `Cannot Read Sessions`)
		return
	}
	returnValue, err := json.Marshal(sessions)
	if err != nil {
		log.Println("Error marshalling sessions")
		io.WriteString(w, `Error marshalling sessions`)
		return
	}
	io.WriteString(w, string(returnValue))
	return
}
func AnswerQuestion(w http.ResponseWriter, r *http.Request) {
	var question models.Question
	err := json.NewDecoder(r.Body).Decode(&question)
	if err != nil {
		log.Println("Error decoding json on AnswerQuestion")
		io.WriteString(w, `Error decoding json on AnswerQuestion`)
		return
	}
	willBeUpdatedQuestion, err := database.ReadQuestions(question)
	if err != nil {
		log.Println("Error getting question from database")
		io.WriteString(w, `Error getting question from database`)
		return
	}
	if willBeUpdatedQuestion[0].Answered == 0 {
		willBeUpdatedQuestion[0].Answered = 1
	} else {
		willBeUpdatedQuestion[0].Answered = 0
	}
	_, err = database.UpdateQuestion(willBeUpdatedQuestion[0])
	if err != nil {
		log.Println("Error updating question on database")
		io.WriteString(w, `Error updating question on database`)
		return
	}
	var session = models.Session{Id: willBeUpdatedQuestion[0].Session.Id}
	questions, err := database.GetQuestions(session)
	if err != nil {
		log.Println("Cannot Read Questions")
		io.WriteString(w, `Cannot Read Questions`)
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

//
func CurrentSession(w http.ResponseWriter, r *http.Request) {
	currentSession, _ := store.Get(r, "session-name")
	if currentSession.Values["session"] == nil || currentSession.Values["session"] == "" {
		io.WriteString(w, `-1`)
		return
	} else {
		returnValue := strconv.Itoa(currentSession.Values["session"].(int))
		io.WriteString(w, string(returnValue))
		return
	}

}
