import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Movie } from 'src/schema/movie';

@Component({
  selector: 'app-user-recommendations',
  templateUrl: './user-recommendations.component.html',
  styleUrls: ['./user-recommendations.component.scss']
})
export class UserRecommendationsComponent {

  @Input() genreMovies: Movie[] = []
  currentGenre: string = ''
  genresList: string[] = ['Animation',
  'Comedy',
  'Family',
  'Adventure',
  'Fantasy',
  'Romance',
  'Drama',
  'Action',
  'Crime',
  'Thriller',
  'Horror',
  'History',
  'Science Fiction',
  'Mystery',
  'Music',
  'Documentary',
  'Western',
  'War',
  'Foreign',
  'TV Movie']
  constructor(private http: HttpClient) {

  }
  
  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange['genreMovies']) {
      this.genreMovies = simpleChange['genreMovies'].currentValue
    }
  }
  ngOnInit() {
  }

  fillGenres() {
    console.log(this.currentGenre)
    let MoviesByGenre = {
      "UserGenre": this.currentGenre
    }
    this.http.post('http://localhost:8080/movies/bygenre/get', JSON.stringify(MoviesByGenre)).subscribe((moviesList: any)=> {
      if (200) {
        console.log("GENRE MOVIES")
        console.log(moviesList)
        this.genreMovies.splice(0)
        for (let i = 0; i < moviesList.length; i++) {
          
          let movie: Movie = new Movie(moviesList[i].ID, moviesList[i].Title, moviesList[i].OriginalLanguage,
            moviesList[i].Overview,"https://image.tmdb.org/t/p/w500" + moviesList[i].PosterPath, moviesList[i].ReleaseDate,
            moviesList[i].RuntimeMinutes, moviesList[i].UserScore, moviesList[i].Accuracy,
            moviesList[i].UserEntries)

          this.genreMovies.push(movie)

        }
        console.log(moviesList)
    this.genreMovies = [...this.genreMovies]
        //alert("Successful Movie Addition to database");
        
      }
      }, (error) => {
        if (error.status === 404) {
          alert('Resource not found.');
        }
        else if (error.status === 403) {
          alert('Forbidden Access to Resource');
        }
        else if (error.status === 409) {
          alert('Movie already exists. Please try another one.');
        }
        else if (error.status === 500) {
          alert('Server down.');
        }
        else if (error.status === 502) {
          alert('Bad gateway.');
        }
      }
      
    );
  }

  genreChanged() {

  }

}
