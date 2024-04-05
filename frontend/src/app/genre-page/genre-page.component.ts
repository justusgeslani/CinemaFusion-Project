import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/schema/movie';

@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.component.html',
  styleUrls: ['./genre-page.component.css']
})
export class GenrePageComponent implements OnInit {
  genreMovies: Movie[] = [];
  genresList: string[] = [
    'Animation', 'Comedy', 'Family', 'Adventure', 'Fantasy', 'Romance', 'Drama', 'Action', 'Crime', 'Thriller', 'Horror',  'History', 'Science Fiction', 'Mystery', 'Music', 'Documentary', 'Western', 'War', 'Foreign', 'TV Movie'
  ];
  selectedGenres: { [key: string]: boolean } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  fillGenres(): void {
    const selectedGenres = Object.keys(this.selectedGenres).filter(genre => this.selectedGenres[genre] === true);
    console.log(selectedGenres);
    const request = {
      genres: selectedGenres
    };

    this.http.post('http://localhost:8080/movies/bygenre/get', request).subscribe(
      (moviesList: any) => {
        // Check if moviesList is not null or undefined
    if (moviesList && moviesList.length) {
        this.genreMovies = [];
        for (let i = 0; i < moviesList.length; i++) {
          const movie: Movie = new Movie(
            moviesList[i].ID,
            moviesList[i].Title,
            moviesList[i].OriginalLanguage,
            moviesList[i].Overview,
            'https://image.tmdb.org/t/p/w500' + moviesList[i].PosterPath,
            moviesList[i].ReleaseDate,
            moviesList[i].RuntimeMinutes,
            moviesList[i].UserScore,
            moviesList[i].Accuracy,
            moviesList[i].UserEntries
          );

          this.genreMovies.push(movie);
        }
      }else {
          console.error('Received null or empty moviesList:', moviesList);
        }
      },
      error => {
        console.error('Error retrieving movies by genre:', error);
        if (error.status === 404) {
          alert('Resource not found.');
        } else if (error.status === 403) {
          alert('Forbidden Access to Resource');
        } else if (error.status === 409) {
          alert('Movie already exists. Please try another one.');
        } else if (error.status === 500) {
          alert('Server down.');
        } else if (error.status === 502) {
          alert('Bad gateway.');
        }
      }
    );
  }
}


