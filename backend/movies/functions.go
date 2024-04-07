package movies

import (
	"backend/connection"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"

	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"

	// openai "github.com/sashabaranov/go-openai"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	UserName string
	jwt.RegisteredClaims
}

func CreateMovieTable() {

	// Create Test Table for Movie Database
	query, err := connection.Db.Exec(
		`CREATE TABLE IF NOT EXISTS MOVIESTEST
			(
				title	VARCHAR(255) NOT NULL,
				year	BIGINT UNSIGNED NOT NULL,
				genre	VARCHAR(255) NOT NULL,
				producer	VARCHAR(255) NOT NULL

			);
		`,
	)
	if err != nil {
		log.Fatal(err)
		//return
	}

	// This line is just for testing query output, remove later
	fmt.Println(query)

}

func UserScoresMovie(c *gin.Context) {
	var userScore UserScore
	err := c.ShouldBindJSON(&userScore)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// Log received data
	log.Println("Received movieID:", userScore.MovieID)
	log.Println("Received movieScore:", userScore.MovieScore)

	mID := userScore.MovieID
	mScore := userScore.MovieScore

	// Updated User Score and Participation Values
	_, err = connection.Db.Exec(
		"UPDATE MOVIEDATA SET user_score = user_score + ?, user_entries = user_entries + 1 WHERE id = ?", mScore, mID)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	_, err = connection.Db.Exec(
		"UPDATE MOVIEDATA SET ACCURACY = user_score / user_entries WHERE id = ?", mID)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusAccepted, &userScore)

}
func AddMovieTest(c *gin.Context) {

	// User's passed in movie to add that gets bound to JSON
	var movieToAdd AddMoviesTest
	err := c.ShouldBindJSON(&movieToAdd)
	fmt.Println(movieToAdd)
	// If passed in variable doesn't bind, server or frontend  schema has issues
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// Store user passed in variables in object variable
	mTitle := movieToAdd.Title
	mYear := movieToAdd.Year
	mGenre := movieToAdd.Genre
	mProd := movieToAdd.Producer

	// Insert Movie into Database
	query, err := connection.Db.Exec(
		"INSERT INTO MOVIESTEST VALUES (?, ?, ?, ?)", mTitle, mYear, mGenre, mProd)

	// Return if unable to add movie to database
	if err != nil {
		fmt.Print("ERROR UNABLE TO ADD MOVIE TO DATABASE!!!\n")
		log.Fatal(err)
		return
	}

	// This line is just for testing query output, remove lator
	fmt.Println(query)

	// Return Http Status Code to frontEnd
	c.JSON(http.StatusCreated, &movieToAdd)
}

func AddMovieTable() {
	// Create Test Table for Movie Database
	query, err := connection.Db.Exec(
		`CREATE TABLE IF NOT EXISTS MOVIES
			(
				titletype	VARCHAR(60) NOT NULL,
				title	VARCHAR(85) NOT NULL,
				originaltitle	VARCHAR(85) NOT NULL,
				year	BIGINT NOT NULL,
				runtime	BIGINT NOT NULL,
				genre	VARCHAR(65) NOT NULL,
				PRIMARY KEY(title, year, genre)
			);
		`,
	)
	if err != nil {
		log.Fatal(err)
		return
	}

	// This line is just for testing query output, remove later
	fmt.Println(query)
}

func GetMoviesCount() int64 {
	count, err := connection.Db.Query("SELECT COUNT(*) FROM MOVIEDATA")
	if err != nil {
		fmt.Println(err)
		return -1
	}
	var returnCount int64
	for count.Next() {
		if err := count.Scan(&returnCount); err != nil {
			fmt.Println(err)
			return -1
		}
	}
	fmt.Printf("COUNT VARIABLE FOR CHARLENE: %d", returnCount)
	return returnCount
}

func GetHundredMovies(c *gin.Context) {

	var allMovies []Movie
	var randomMovie Movie
	moviesReturned, err := connection.Db.Query(
		"SELECT * FROM MOVIEDATA ORDER BY ID LIMIT 100")

	if err != nil {
		fmt.Println(err)
		return
	}

	for moviesReturned.Next() {
		if err := moviesReturned.Scan(&randomMovie.ID, &randomMovie.Title,
			&randomMovie.OriginalLanguage, &randomMovie.Overview, &randomMovie.PosterPath,
			&randomMovie.ReleaseDate, &randomMovie.RuntimeMinutes,
			&randomMovie.UserScore, &randomMovie.Accuracy, &randomMovie.UserEntries); err != nil {
			fmt.Println(err)
			return
		}
		allMovies = append(allMovies, randomMovie)
	}

	c.JSON(http.StatusAccepted, &allMovies)
}

func GetAllMovies(c *gin.Context) {
	var allMovies []Movie
	var randomMovie Movie
	moviesReturned, err := connection.Db.Query(
		"SELECT * FROM MOVIEDATA ORDER BY ID")

	if err != nil {
		fmt.Println(err)
		return
	}

	for moviesReturned.Next() {
		if err := moviesReturned.Scan(&randomMovie.ID, &randomMovie.Title,
			&randomMovie.OriginalLanguage, &randomMovie.Overview, &randomMovie.PosterPath,
			&randomMovie.ReleaseDate, &randomMovie.RuntimeMinutes,
			&randomMovie.UserScore, &randomMovie.Accuracy, &randomMovie.UserEntries); err != nil {
			fmt.Println(err)
			return
		}
		allMovies = append(allMovies, randomMovie)
	}

	c.JSON(http.StatusAccepted, &allMovies)
}

func GetRandomMovie(c *gin.Context) {

	var randomMovie Movie
	randMovieIndex := rand.Int63n(GetMoviesCount())
	movieReturned, err := connection.Db.Query(
		"SELECT * FROM MOVIEDATA ORDER BY ID LIMIT ?, 1", randMovieIndex-1)

	if err != nil {
		fmt.Println(err)
		return
	}
	for movieReturned.Next() {
		if err := movieReturned.Scan(&randomMovie.ID, &randomMovie.Title,
			&randomMovie.OriginalLanguage, &randomMovie.Overview, &randomMovie.PosterPath,
			&randomMovie.ReleaseDate, &randomMovie.RuntimeMinutes,
			&randomMovie.UserScore, &randomMovie.Accuracy, &randomMovie.UserEntries); err != nil {
			fmt.Println(err)
			return
		}
	}

	c.JSON(http.StatusAccepted, &randomMovie)
}

func GetRandomMovies(c *gin.Context) {

	var randomMovies []Movie
	var randomMovie Movie

	for i := 0; i < 3; i++ {
		randMovieIndex := rand.Int63n(GetMoviesCount())
		movieReturned, err := connection.Db.Query(
			"SELECT * FROM MOVIEDATA ORDER BY ID LIMIT ?, 1", randMovieIndex-1)

		if err != nil {
			fmt.Println(err)
			return
		}
		for movieReturned.Next() {
			if err := movieReturned.Scan(&randomMovie.ID, &randomMovie.Title,
				&randomMovie.OriginalLanguage, &randomMovie.Overview, &randomMovie.PosterPath,
				&randomMovie.ReleaseDate, &randomMovie.RuntimeMinutes,
				&randomMovie.UserScore, &randomMovie.Accuracy, &randomMovie.UserEntries); err != nil {
				fmt.Println(err)
				return
			}
		}
		randomMovies = append(randomMovies, randomMovie)

	}

	c.JSON(http.StatusAccepted, &randomMovies)
}

func AddUsersFavorites(c *gin.Context) {

	var usersFavorites []Favorites
	err := c.ShouldBindJSON(&usersFavorites)
	if err != nil {
		fmt.Println(err)
		return
	}

	if len(usersFavorites) == 0 {
		c.JSON(http.StatusAccepted, "No favorites to add")
	}
	var returnFavorites []Favorites

	// Delete all users' favorites
	_, err = connection.Db.Exec("DELETE FROM UserFavorites WHERE username = ?", usersFavorites[0].UserName)
	if err != nil {
		fmt.Println(err)
		return
	}
	// Reinsert users' favorites
	for _, value := range usersFavorites {
		_, err := connection.Db.Exec("INSERT INTO UserFavorites VALUES (?, ?)", value.MovieID, value.UserName)
		if err != nil {
			fmt.Println(err)
			return
		}
	}

	// Get user's favorites to return
	favoritesReturned, err := connection.Db.Query("SELECT * FROM UserFavorites WHERE username = ?", usersFavorites[0].UserName)
	for favoritesReturned.Next() {
		var currentFavorite Favorites
		if err := favoritesReturned.Scan(&currentFavorite.MovieID, &currentFavorite.UserName); err != nil {
			fmt.Println(err)
			return
		}
		returnFavorites = append(returnFavorites, currentFavorite)
	}

	if err != nil {
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusAccepted, &returnFavorites)
}

func GetUsersFavorites(c *gin.Context) {

	var user GetFavorites
	err := c.ShouldBindJSON(&user)
	if err != nil {
		fmt.Println(err)
		return
	}
	var userMovies []Movie
	// Get user's favorites to return
	favoritesReturned, err := connection.Db.Query("SELECT * FROM UserFavorites WHERE username = ?", user.UserName)
	for favoritesReturned.Next() {
		var currentFavorite Favorites
		if err := favoritesReturned.Scan(&currentFavorite.MovieID, &currentFavorite.UserName); err != nil {
			fmt.Println(err)
			return
		}
		moviesReturned, err := connection.Db.Query("SELECT * FROM MOVIEDATA WHERE ID = ?", currentFavorite.MovieID)
		if err != nil {
			fmt.Println(err)
			return
		}
		var randomMovie Movie

		for moviesReturned.Next() {
			if err := moviesReturned.Scan(&randomMovie.ID, &randomMovie.Title,
				&randomMovie.OriginalLanguage, &randomMovie.Overview, &randomMovie.PosterPath,
				&randomMovie.ReleaseDate, &randomMovie.RuntimeMinutes,
				&randomMovie.UserScore, &randomMovie.Accuracy, &randomMovie.UserEntries); err != nil {
				fmt.Println(err)
				return
			}
			userMovies = append(userMovies, randomMovie)
		}
	}

	if err != nil {
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusAccepted, &userMovies)
}

// User Functions
func SignUpUser(c *gin.Context) {

	var userToCreate SignUp

	// Bind JSON Data to Object
	err := c.BindJSON(&userToCreate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "")
	}
	uName := userToCreate.UserName
	// hash the password
	hashPass, err := HashPassword(userToCreate.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "")
	}
	fName := userToCreate.FirstName
	lName := userToCreate.LastName
	_, err = connection.Db.Exec(
		"INSERT INTO USERS VALUES (?, ?, ?, ?)", uName, hashPass, fName, lName)

	// create jwt to login
	expirationTime := time.Now().Add(30000 * time.Minute)
	// Create the JWT claims, which includes the username and expiry time
	claims := &Claims{
		UserName: userToCreate.UserName,
		RegisteredClaims: jwt.RegisteredClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(connection.JwtKey)

	var userToSend GetUser
	userToSend.FirstName = userToCreate.FirstName
	userToSend.LastName = userToCreate.LastName
	userToSend.UserName = userToCreate.UserName
	userToSend.Token = tokenString
	if err != nil {
		c.JSON(http.StatusInternalServerError, "")
	}

	c.JSON(http.StatusOK, &userToSend)
}

func LoginUser(c *gin.Context) {
	var loginData Login
	var user SignUp
	// Bind JSON Data to Object
	err := c.BindJSON(&loginData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "")
	}

	userReturned, err := connection.Db.Query(
		"SELECT * FROM USERS WHERE username = ?", loginData.UserName)

	if err != nil {
		fmt.Println(err)
		return
	}
	for userReturned.Next() {
		if err := userReturned.Scan(&user.UserName, &user.Password, &user.FirstName,
			&user.LastName); err != nil {
			fmt.Println(err)
			return
		}
	}
	checkHash := CheckPasswordHash(loginData.Password, user.Password)
	if checkHash == true {

		expirationTime := time.Now().Add(5 * time.Minute)
		// Create the JWT claims, which includes the username and expiry time
		claims := &Claims{
			UserName: loginData.UserName,
			RegisteredClaims: jwt.RegisteredClaims{
				// In JWT, the expiry time is expressed as unix milliseconds
				ExpiresAt: jwt.NewNumericDate(expirationTime),
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		// Create the JWT string
		tokenString, err := token.SignedString(connection.JwtKey)
		if err != nil {
			c.JSON(http.StatusInternalServerError, "")
		}
		var tokenUser UserByToken
		tokenUser.Token = tokenString
		tokenUser.FirstName = user.FirstName
		tokenUser.LastName = user.LastName
		tokenUser.UserName = user.UserName
		c.JSON(http.StatusOK, &tokenUser)
	} else {
		c.JSON(http.StatusInternalServerError, "SOMETHINGS WRONG")
	}
}

func GetCurrentUser(c *gin.Context) {
	var loginData Login
	var user SignUp
	// Bind JSON Data to Object
	err := c.BindJSON(&loginData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "")
	}

	userReturned, err := connection.Db.Query(
		"SELECT username, password, FirstName, LastName FROM USERS WHERE username = ?", loginData.UserName)

	if err != nil {
		fmt.Println(err)
		return
	}
	for userReturned.Next() {
		if err := userReturned.Scan(&user.UserName, &user.Password, &user.FirstName,
			&user.LastName); err != nil {
			fmt.Println(err)
			return
		}
	}
	checkHash := CheckPasswordHash(loginData.Password, user.Password)
	if checkHash == true {

		expirationTime := time.Now().Add(5 * time.Minute)
		// Create the JWT claims, which includes the username and expiry time
		claims := &Claims{
			UserName: loginData.UserName,
			RegisteredClaims: jwt.RegisteredClaims{
				// In JWT, the expiry time is expressed as unix milliseconds
				ExpiresAt: jwt.NewNumericDate(expirationTime),
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		// Create the JWT string
		tokenString, err := token.SignedString(connection.JwtKey)
		if err != nil {
			c.JSON(http.StatusInternalServerError, "")
		}
		var tokenUser UserByToken
		tokenUser.Token = tokenString
		tokenUser.FirstName = user.FirstName
		tokenUser.LastName = user.LastName
		tokenUser.UserName = user.UserName
		c.JSON(http.StatusOK, &tokenUser)
	}
}

func auth() gin.HandlerFunc {

	return func(c *gin.Context) {
		var authHeader = c.Request.Header.Get("Authorization")
		substrings := strings.Split(authHeader, " ")
		tokenFromHeader := substrings[1]
		claims := jwt.MapClaims{}
		_, err := jwt.ParseWithClaims(tokenFromHeader, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(connection.JwtKey), nil
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, "")

		} else {
			c.Next()
		}

	}
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
func CheckPasswordHash(password, hash string) bool {

	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

type Content struct {
	Parts []string `json:Parts`
	Role  string   `json:Role`
}
type Candidates struct {
	Content *Content `json:Content`
}
type ContentResponse struct {
	Candidates *[]Candidates `json:Candidates`
}

func GetMoviesByQuiz(c *gin.Context) {
	var vmq MoviesByQuiz
	err := c.ShouldBindJSON(&vmq)
	if err != nil {
		fmt.Println(err)
		return
	}
	ctx := context.Background()
	// Access your API key as an environment variable (see "Set up your API key" above)
	client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("CINEMA_FUSION_GOOGLE_API_KEY")))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()
	model := client.GenerativeModel("gemini-pro")
	fmt.Println(vmq)
	prompt := "Recommend a movie based on the following, and respond in a json format containing only title, year, genre, runtime, and plot\nMy weather: " + vmq.Weather + "\nMy mood: " + vmq.Feelings + "\nMy age: " + vmq.Age + "\nMy gender: " + vmq.Gender + "\nMy release preference: " + vmq.When + "\nDuration of movie: " + vmq.Time
	fmt.Println(prompt)
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		log.Fatal(err)
	}

	marshalResponse, _ := json.MarshalIndent(resp, "", "  ")
	// fmt.Println(marshalResponse)
	var generateResponse ContentResponse
	if err := json.Unmarshal(marshalResponse, &generateResponse); err != nil {
		log.Fatal(err)
	}
	var result string
	for _, cad := range *generateResponse.Candidates {
		if cad.Content != nil {
			for _, part := range cad.Content.Parts {
				result = part
			}
		}
	}

	if result[0] == '`' {
		result = result[7 : len(result)-3]
	}

	var retMovie MovieFromAI
	err = json.Unmarshal([]byte(result), &retMovie)

	var randomMovie Movie
	found := false
	for !found {

		query, err := connection.Db.Query(
			"SELECT * FROM MOVIEDATA WHERE title = ? LIMIT 1", retMovie.Title)
		for query.Next() {
			found = true
			fmt.Println("AT LEAST ONE FOUND")
			err := query.Scan(&randomMovie.ID, &randomMovie.Title,
				&randomMovie.OriginalLanguage, &randomMovie.Overview, &randomMovie.PosterPath,
				&randomMovie.ReleaseDate, &randomMovie.RuntimeMinutes,
				&randomMovie.UserScore, &randomMovie.Accuracy, &randomMovie.UserEntries)
			if err != nil {
				fmt.Println(err)
				return
			}
			c.JSON(http.StatusAccepted, &randomMovie)
			return

		}

		resp, err = model.GenerateContent(ctx, genai.Text(prompt))
		if err != nil {
			log.Fatal(err)
		}

		marshalResponse, _ = json.MarshalIndent(resp, "", "  ")

		if err := json.Unmarshal(marshalResponse, &generateResponse); err != nil {
			log.Fatal(err)
		}

		for _, cad := range *generateResponse.Candidates {
			if cad.Content != nil {
				for _, part := range cad.Content.Parts {
					result = part
				}
			}
		}

		if result[0] == '`' {
			result = result[7 : len(result)-3]
		}
		fmt.Println("RESULT: " + result)
		err = json.Unmarshal([]byte(result), &retMovie)
	}

	//c.JSON(http.StatusAccepted, &randomMovie)

}

func GetMoviesByGenre(c *gin.Context) {

	var userGenres []string
	var randomMovie Movie
	var genres []Genre
	// 	var randGenre Genre
	var userGenreMovies []Movie
	err := c.ShouldBindJSON(&userGenres)
	if err != nil {
		fmt.Println(err)
		return
	}
	// 	fmt.Println(userGenre.UserGenre)

	for _, value := range userGenres {
		genreReturned, err := connection.Db.Query(
			"SELECT * FROM GENRES WHERE genre_name = ? ORDER BY RAND() LIMIT 1", value)
		if err != nil {
			fmt.Println(err)
			return
		}
		var randGenre Genre
		for genreReturned.Next() {
			if err := genreReturned.Scan(&randGenre.GenreID, &randGenre.GenreName, &randGenre.MovieID); err != nil {
				fmt.Println(err)
				return
			}
			genres = append(genres, randGenre)

		}

	}

	for _, value := range genres {
		movieReturned, err := connection.Db.Query(
			"SELECT * FROM MOVIEDATA WHERE ID = ?", value.MovieID)
		if err != nil {
			fmt.Println(err)
			return
		}
		for movieReturned.Next() {
			if err := movieReturned.Scan(&randomMovie.ID, &randomMovie.Title,
				&randomMovie.OriginalLanguage, &randomMovie.Overview, &randomMovie.PosterPath,
				&randomMovie.ReleaseDate, &randomMovie.RuntimeMinutes,
				&randomMovie.UserScore, &randomMovie.Accuracy, &randomMovie.UserEntries); err != nil {
				fmt.Println(err)
				return
			}
			userGenreMovies = append(userGenreMovies, randomMovie)
		}

	}

	c.JSON(http.StatusAccepted, &userGenreMovies)
}

/*
func GetMoviesByGenre(c *gin.Context) {
	var userGenre MoviesByGenre
	var userGenreMovies []Movie

	// Parse request body to get selected genres
	if err := c.ShouldBindJSON(&userGenreMovies); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}
	fmt.Println(userGenre.UserGenre)
	genreReturned, err := connection.Db.Query(
		"SELECT * FROM GENRES WHERE genre_name = ? ORDER BY RAND() LIMIT 3", userGenre.UserGenre)
	if err != nil {
		fmt.Println(err)

	// Check if userGenre.UserGenre is empty
	if len(userGenreMovies) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No genres selected"})
		return
	}

	// Build the SQL query to fetch movies based on selected genres
	query := `
        SELECT M.*
        FROM MOVIEDATA M
        JOIN GENRES G ON M.id = G.movie_id
        WHERE G.genre_name IN (` + getInClause(len(userGenre.UserGenre)) + `)
    `

	// Create a slice to hold genre values as interface{}
	genreValues := make([]interface{}, len(userGenre.UserGenre))
	for i, genre := range userGenre.UserGenre {
		genreValues[i] = genre
	}

	// Execute the SQL query
	rows, err := connection.Db.Query(query, genreValues...)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	defer rows.Close() // Close rows after use

	// Iterate over query results and populate movie list
	for rows.Next() {
		var movie Movie
		if err := rows.Scan(
			&movie.ID, &movie.Title,
			&movie.OriginalLanguage, &movie.Overview, &movie.PosterPath,
			&movie.ReleaseDate, &movie.RuntimeMinutes,
			&movie.UserScore, &movie.Accuracy, &movie.UserEntries,
		); err != nil {
			fmt.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		userGenreMovies = append(userGenreMovies, movie)
	}

	// Check for errors during row iteration
	if err := rows.Err(); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// Return movie list as JSON response
	c.JSON(http.StatusOK, userGenreMovies)
}*/

// Function to generate IN clause for SQL query
func getInClause(n int) string {
	inClause := "("
	for i := 0; i < n; i++ {
		inClause += "?"
		if i < n-1 {
			inClause += ","
		}
	}
	inClause += ")"
	return inClause
}

func AddDBCompany(c *gin.Context) {
	var companyToAdd ProductionCompany
	err := c.ShouldBindJSON(&companyToAdd)
	//fmt.Println(companyToAdd)
	// If passed in variable doesn't bind, server or frontend  schema has issues
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		//fmt.Println(err)
		//return
	}
	pcID := companyToAdd.CompanyID
	pcName := companyToAdd.CompanyName
	mID := companyToAdd.MovieID // Insert Company into Database
	_, err = connection.Db.Exec(
		"INSERT INTO ProductionCompanies VALUES (?, ?, ?)", pcID, pcName, mID)
	// Return if unable to add movie to database
	if err != nil {
		//fmt.Println(err)
		//return
	}

	// This line is just for testing query output, remove lator
	//fmt.Println(query)

	// Return Http Status Code to frontEnd
	c.Set("logDisabled", true)
	c.JSON(http.StatusCreated, &companyToAdd)

}
func AddDBMovie(c *gin.Context) {
	var movieToAdd Movie
	err := c.ShouldBindJSON(&movieToAdd)
	//fmt.Println(movieToAdd)
	// If passed in variable doesn't bind, server or frontend  schema has issues
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		//fmt.Println(err)
		//return
	}

	// Store user passed in variables in object variable
	mID := movieToAdd.ID
	mTitle := movieToAdd.Title
	mLanguage := movieToAdd.OriginalLanguage
	mOverview := movieToAdd.Overview
	mPosterPath := movieToAdd.PosterPath
	mReleaseDate := movieToAdd.ReleaseDate
	mRuntimeMinutes := movieToAdd.RuntimeMinutes
	mUserScore := movieToAdd.UserScore
	mAccuracy := movieToAdd.Accuracy

	// Insert Movie into Database
	_, err = connection.Db.Exec(
		"INSERT INTO MOVIEDATA VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", mID, mTitle, mLanguage, mOverview, mPosterPath, mReleaseDate, mRuntimeMinutes, mUserScore, mAccuracy)

	// Return if unable to add movie to database
	if err != nil {
		//fmt.Println(err)
		//return
	}

	// This line is just for testing query output, remove lator
	//fmt.Println(query)

	// Return Http Status Code to frontEnd
	c.JSON(http.StatusCreated, &movieToAdd)

}
func GetMoviesTest(c *gin.Context) {

	// Get all movies from database
	queryResult, err := connection.Db.Query(
		`SELECT * FROM MOVIESTEST`,
	)

	// If database retrieval yields error, return
	if err != nil {
		log.Fatal(err)
	}

	var movies []MoviesTest

	for queryResult.Next() {
		var movie MoviesTest
		err := queryResult.Scan(&movie.Title, &movie.Year, &movie.Genre, &movie.Producer)

		if err != nil {

			// For testing remove later
			fmt.Print("\nError storing database results in Golang Variables!\n")

			log.Fatal(err)
			return
		}

		movies = append(movies, movie)
	}
	// For testing remove later
	fmt.Print("\nMOVIES COMPLETE LIST!!!\n-------------------------------\n")

	// Print all movies for testing, remove later
	for _, movie := range movies {
		fmt.Printf("\nTitle: %s\tYear: %d\tGenre: %s\tProducer: %s", movie.Title, movie.Year, movie.Genre, movie.Producer)
	}
	c.JSON(http.StatusAccepted, &movies)
}

func DeleteMovieTest(c *gin.Context) {

}

func UpdateMovieTest(c *gin.Context) {

}
