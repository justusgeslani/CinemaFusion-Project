import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Movie } from 'src/schema/movie';

@Component({
  selector: 'app-random-user-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './random-user-movie.component.html',
  styleUrl: './random-user-movie.component.scss'
})
export class RandomUserMovieComponent {
  
  @Input() randomMovies: Movie[] = []
  constructor(private http: HttpClient) {

  }
  ngOnInit() {
    this.fillRandoms()
  }
  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange['randomMovies']) {
      this.randomMovies = simpleChange['randomMovies'].currentValue
    }
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
  
  fillRandoms() {
    this.http.get('http://localhost:8080/random/movies/get').subscribe((moviesList: any)=> {
      if (200) {
        this.randomMovies.splice(0)
        console.log(moviesList)
        for (let i = 0; i < moviesList.length; i++) {
          
          let movie: Movie = new Movie(moviesList[i].ID, moviesList[i].Title, moviesList[i].OriginalLanguage,
            moviesList[i].Overview,"https://image.tmdb.org/t/p/w500" + moviesList[i].PosterPath, moviesList[i].ReleaseDate,
            moviesList[i].RuntimeMinutes, moviesList[i].UserScore, moviesList[i].Accuracy,
            moviesList[i].UserEntries)

          this.randomMovies.push(movie)

        }
        
    this.randomMovies = [...this.randomMovies]
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
