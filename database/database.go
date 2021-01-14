package database

import (
	"database/sql"
	"errors"
	"log"
	"os"
	"strconv"

	"github.com/anilkusc/QuPoll/models"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func InitDB(database string, username string, password string) error {

	// if file does not exist
	if _, err := os.Stat(database); os.IsNotExist(err) {
		log.Println("Database can not be found.Creating new...")
		file, err := os.Create(database) // Create SQLite file
		if err != nil {
			log.Fatal(err)
		}
		file.Close()
		db, err = sql.Open("sqlite3", database)
		if err != nil {
			return err
		}
		log.Println("Created database file: " + database)
		createUsersTable := "CREATE TABLE IF NOT EXISTS Users (Id INTEGER PRIMARY KEY AUTOINCREMENT,Username TEXT NOT NULL UNIQUE,Password TEXT NOT NULL,Role TEXT NOT NULL);"
		statement, err := db.Prepare(createUsersTable)
		if err != nil {
			log.Fatal(err)
		}
		statement.Exec()
		log.Println("Created Users table")
		createSessionsTable := "CREATE TABLE IF NOT EXISTS Sessions (Id INTEGER PRIMARY KEY AUTOINCREMENT,Name TEXT NOT NULL UNIQUE,Password TEXT,UserVoteCount INTEGER DEFAULT '1',TotalVoteCount INTEGER DEFAULT '1000');"
		statement, err = db.Prepare(createSessionsTable)
		if err != nil {
			log.Fatal(err)
		}
		statement.Exec()
		log.Println("Created Sessions table")
		createQuestionsTable := "CREATE TABLE IF NOT EXISTS Questions (Id INTEGER PRIMARY KEY AUTOINCREMENT,Asker TEXT DEFAULT 'Anonymous',Date TEXT DEFAULT 'DD.MM.YYYY HH:MM',SessionId INTEGER NOT NULL,Question TEXT NOT NULL,    LikeCount INTEGER DEFAULT '0',Answered INTEGER DEFAULT '0',Approved INTEGER DEFAULT '0',FOREIGN KEY (SessionId) REFERENCES Sessions (Id) ON DELETE CASCADE);"
		statement, err = db.Prepare(createQuestionsTable)
		if err != nil {
			log.Fatal(err)
		}
		statement.Exec()
		log.Println("Created Questions table")
		enableFK := "PRAGMA foreign_keys=ON;"
		statement, err = db.Prepare(enableFK)
		if err != nil {
			log.Fatal(err)
		}
		statement.Exec()
		log.Println("Foreign Key enabled for sqlite.")
		log.Println("Created tables")
		initUser := models.User{
			Username: username,
			Password: password,
			Role:     "admin",
		}
		initSession := models.Session{
			Name: "first",
		}
		_, err = CreateUser(initUser)
		if err != nil {
			log.Fatal(err)
		}
		log.Println("Created init(admin) user: " + username)
		_, err = CreateSession(initSession)
		if err != nil {
			log.Fatal(err)
		}
		log.Println("Created init session.")
		return db.Ping()
	} else {
		log.Println("Database file found.")
		var err error
		db, err = sql.Open("sqlite3", database)
		if err != nil {
			return err
		}

		return db.Ping()
	}
}

func CreateSession(session models.Session) (models.Session, error) {

	statement, err := db.Prepare("INSERT INTO Sessions (Name,Password,UserVoteCount,TotalVoteCount) VALUES(?,?,?,?)")
	if err != nil {
		return session, err
	}
	statement.Exec(session.Name, session.Password, session.UserVoteCount, session.TotalVoteCount)
	statement.Close()

	return session, nil
}

func ReadSessions(session ...models.Session) ([]models.Session, error) {
	var query string
	if len(session) < 1 {
		query = "SELECT * FROM Sessions"

	} else if len(session) == 1 {
		if session[0].Id == 0 {
			query = "SELECT * FROM Sessions where Name='" + session[0].Name + "'"
		} else {
			query = "SELECT * FROM Sessions where Id='" + strconv.Itoa(session[0].Id) + "'"
		}
	} else {
		err := errors.New("There is more than 1 arguments")
		return nil, err
	}

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessions []models.Session

	for rows.Next() {
		var session models.Session
		err := rows.Scan(&session.Id, &session.Name, &session.Password, &session.UserVoteCount, &session.TotalVoteCount)
		if err != nil {
			return nil, err
		}

		sessions = append(sessions, session)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sessions, nil
}

func UpdateSession(session models.Session) (models.Session, error) {

	statement, err := db.Prepare("UPDATE Sessions SET Name=? , Password=? , UserVoteCount=? , TotalVoteCount=? where Id=?")
	if err != nil {
		return session, err
	}
	statement.Exec(session.Name, session.Password, session.UserVoteCount, session.TotalVoteCount, session.Id)
	statement.Close()

	return session, nil
}

func DeleteSessions(sessions []models.Session) ([]models.Session, error) {

	for _, session := range sessions {
		statement, err := db.Prepare("DELETE FROM Sessions where Id=?")
		if err != nil {
			return nil, err
		}
		statement.Exec(session.Id)
		statement.Close()
	}

	return sessions, nil
}

func CreateUser(user models.User) (models.User, error) {

	statement, err := db.Prepare("INSERT INTO Users (Username,Password,Role) VALUES(?,?,?)")
	if err != nil {
		return user, err
	}
	statement.Exec(user.Username, user.Password, user.Role)
	statement.Close()

	return user, nil
}

func ReadUsers(user ...models.User) ([]models.User, error) {
	var query string
	if len(user) < 1 {
		query = "SELECT * FROM Users"

	} else if len(user) == 1 {
		if user[0].Id == 0 {
			query = "SELECT * FROM Users where Username=" + "'" + user[0].Username + "'"
		} else {
			query = "SELECT * FROM Users where Id=" + "'" + strconv.Itoa(user[0].Id) + "'"
		}

	} else {
		err := errors.New("There is more than 1 arguments")
		return nil, err
	}

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User

	for rows.Next() {
		var user models.User
		err := rows.Scan(&user.Id, &user.Username, &user.Password, &user.Role)
		if err != nil {
			return nil, err
		}

		users = append(users, user)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func UpdateUser(user models.User) (models.User, error) {
	//var users []models.User
	//users, _ = ReadUsers(user)
	//user.Id = users[0].Id
	statement, err := db.Prepare("UPDATE Users SET Username=? , Password=? , Role=? where Id=?")
	if err != nil {
		return user, err
	}
	statement.Exec(user.Username, user.Password, user.Role, user.Id)
	statement.Close()

	return user, nil
}

func DeleteUsers(users []models.User) ([]models.User, error) {
	// TODO: not delete with foreach.Delete all the given users on the database side.
	for _, user := range users {

		/*var tempUsers []models.User
		tempUsers, _ = ReadUsers(user)
		user.Id = tempUsers[0].Id
		*/
		statement, err := db.Prepare("DELETE FROM Users where Id=?")
		if err != nil {
			return nil, err
		}
		statement.Exec(user.Id)
		statement.Close()
	}

	return users, nil
}

func CreateQuestion(question models.Question) (models.Question, error) {

	statement, err := db.Prepare("INSERT INTO Questions (SessionId,Asker,Question,LikeCount,Answered,Date) VALUES(?,?,?,?,?,?)")
	if err != nil {
		return question, err
	}
	statement.Exec(question.Session.Id, question.Asker, question.Question, question.LikeCount, question.Answered, question.Date)
	statement.Close()

	return question, nil
}

func ReadQuestions(question ...models.Question) ([]models.Question, error) {
	var query string
	if len(question) < 1 {
		query = "SELECT * FROM Questions WHERE SessionId=" + strconv.Itoa(question[0].Session.Id)

	} else if len(question) == 1 {
		query = "SELECT * FROM Questions where id='" + strconv.Itoa(question[0].Id) + "'"
	} else {
		err := errors.New("There is more than 1 arguments")
		return nil, err
	}

	//query = "SELECT * FROM Questions where SessionId=" + strconv.Itoa(session.Id)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var questions []models.Question

	for rows.Next() {
		var question models.Question
		err := rows.Scan(&question.Id, &question.Asker, &question.Date, &question.Session.Id, &question.Question, &question.LikeCount, &question.Answered, &question.Approved)
		if err != nil {
			return nil, err
		}

		questions = append(questions, question)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return questions, nil
}

func UpdateQuestion(question models.Question) (models.Question, error) {

	statement, err := db.Prepare("UPDATE Questions SET Question=? , LikeCount=? , Answered=? where Id=?")
	if err != nil {
		return question, err
	}
	statement.Exec(question.Question, question.LikeCount, question.Answered, question.Id)
	statement.Close()

	return question, nil
}

func DeleteQuestions(questions []models.Question) ([]models.Question, error) {

	for _, question := range questions {
		statement, err := db.Prepare("DELETE FROM Questions where Id=?")
		if err != nil {
			return nil, err
		}
		statement.Exec(question.Id)
		statement.Close()
	}
	return questions, nil
}

///////////////////////////////////
func GetQuestions(session models.Session) ([]models.Question, error) {
	var query string
	query = "SELECT * FROM Questions where SessionId=" + strconv.Itoa(session.Id)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var questions []models.Question

	for rows.Next() {
		var question models.Question
		err := rows.Scan(&question.Id, &question.Asker, &question.Date, &question.Session.Id, &question.Question, &question.LikeCount, &question.Answered, &question.Approved)
		if err != nil {
			return nil, err
		}

		questions = append(questions, question)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return questions, nil
}
func ChangeSession(session models.Session) (models.Session, error) {

	query := "SELECT * FROM Sessions where Id='" + strconv.Itoa(session.Id) + "'"

	rows, err := db.Query(query)
	if err != nil {
		return session, err
	}
	defer rows.Close()

	var sessions []models.Session

	for rows.Next() {
		var tempSession models.Session
		err := rows.Scan(&tempSession.Id, &tempSession.Name, &tempSession.Password, &tempSession.UserVoteCount, &tempSession.TotalVoteCount)
		if err != nil {
			return session, err
		}

		sessions = append(sessions, tempSession)
	}
	if err = rows.Err(); err != nil {
		return session, err
	}

	return sessions[0], nil
}
