package models

type User struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type Session struct {
	Id             int    `json:"id"`
	Name           string `json:"session_name"`
	Password       string `json:"password"`
	UserVoteCount  int    `json:"user_vote_count"`
	TotalVoteCount int    `json:"total_vote_count"`
}

type Question struct {
	Id        int     `json:"id"`
	Asker     string  `json:"asker"`
	Date      string  `json:"date"`
	Session   Session `json:"session"`
	Question  string  `json:"question"`
	LikeCount int     `json:"like_count"`
	Answered  int     `json:"answered"`
	Approved  int     `json:"approved"`
}

type Auth struct {
	User          User `json:"user_information"`
	Authenticated bool `json:"authenticated"`
}
