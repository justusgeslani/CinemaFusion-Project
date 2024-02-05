package main

import (
	"backend/movies"
	"backend/router"
)

func main() {

	movies.CreateMovieTable()
	// Creates Movies DB
	router.Router.Run()
}
