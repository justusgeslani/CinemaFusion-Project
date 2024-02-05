package movies

// Test schema for movies
type MoviesTest struct {
	Title    string
	Year     uint64
	Genre    string
	Producer string
}

type AddMoviesTest struct {
	Title    string
	Year     uint64
	Genre    string
	Producer string
}

type GetMovieTest struct {
	Title string
}

type DeleteMoviesTest struct {
	Title string
}

type EditMoviesTest struct {
	Title    string
	Year     uint64
	Genre    string
	Producer string
}
