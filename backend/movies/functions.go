package movies

import (
	"fmt"
	"log"
	"net/http"

	"backend/connection"

	"github.com/gin-gonic/gin"
)

func CreateMovieTable() {
	connection.OpenConn()

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
		return
	}

	// This line is just for testing query output, remove later
	fmt.Println(query)

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
		err := queryResult.Scan(&movie.Title, movie.Year, movie.Genre, movie.Producer)

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
