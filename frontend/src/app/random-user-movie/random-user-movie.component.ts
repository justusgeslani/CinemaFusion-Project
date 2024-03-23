import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Movie } from 'src/schema/movie';

@Component({
  selector: 'app-random-user-movie',
  standalone: true,
  imports: [],
  templateUrl: './random-user-movie.component.html',
  styleUrl: './random-user-movie.component.css'
})
export class RandomUserMovieComponent {

  constructor(private http: HttpClient) {

  }
  getRandomMovie() {
    
    this.http.get('http://localhost:8080/random/movie/get').subscribe((randomMovie: any)=> {
      if (200) {
        console.log(randomMovie)
          let movie: Movie = new Movie(randomMovie.ID, randomMovie.Title, randomMovie.OriginalLanguage,
            randomMovie.Overview, randomMovie.PosterPath, randomMovie.ReleaseDate,
            randomMovie.RuntimeMinutes, randomMovie.UserScore, randomMovie.Accuracy,
            randomMovie.UserEntries)
            console.log("MOVIE INFO")
            console.log(randomMovie)

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

  getMovieBasedOnSurvey() {
    
  }
}
