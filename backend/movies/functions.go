package movies

import (
	"backend/connection"
	"fmt"
	"log"
	"math/rand"
	"net/http"

	"github.com/gin-gonic/gin"
)

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
	mID := userScore.movieID
	mScore := userScore.movieScore

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

func GetMoviesByGenre(c *gin.Context) {

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

func AddDBGenre(c *gin.Context) {
	c.Set("logDisabled", true)
	var genreToAdd Genre
	err := c.ShouldBindJSON(&genreToAdd)
	//fmt.Println(genreToAdd)
	// If passed in variable doesn't bind, server or frontend  schema has issues
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		//fmt.Println(err)
		//return
	}
	gID := genreToAdd.GenreID
	gName := genreToAdd.GenreName
	mID := genreToAdd.MovieID // Insert Movie into Database
	_, err = connection.Db.Exec(
		"INSERT INTO GENRES VALUES (?, ?, ?)", gID, gName, mID)
	// Return if unable to add movie to database
	if err != nil {
		////fmt.Println(err)
		//return
	}

	// This line is just for testing query output, remove lator
	//fmt.Println(query)

	// Return Http Status Code to frontEnd
	c.JSON(http.StatusCreated, &genreToAdd)
}

func AddDBCompany(c *gin.Context) {
	c.Set("logDisabled", true)
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
	c.Set("logDisabled", true)
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
