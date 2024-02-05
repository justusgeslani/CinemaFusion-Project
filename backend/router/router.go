package router

import (
	"backend/movies"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var Router = gin.Default()

// This engine powers serve persistently keeping it running
func PrepareRouter(test bool) *gin.Engine {

	// Only allow origins from the frontend, to avoid malicious attacks
	var config = cors.DefaultConfig()

	// Only allow origins from the frontend, to avoid malicious attacks
	config.AllowOrigins = []string{"http://localhost:4200"}

	// Router should use configurations and origins just set
	Router.Use(cors.New(config))

	//repos := actions.New(test)
	//Router.GET("/ping", actions.Ping)

	Router.POST("/movies/create", movies.AddMovieTest)
	Router.POST("/movies/get", movies.GetMoviesTest)
	//Router.POST("/users/get", repos.GetUser)

	return Router
}