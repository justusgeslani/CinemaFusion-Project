import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import { Movie, UserFavorites } from 'src/schema/movie';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { NgForm, ReactiveFormsModule , FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-user-favorites',
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule,	NgSelectModule, CommonModule],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.scss'
})
export class UserFavoritesComponent {
  @Input() allMovies: Movie[] = []
  @Input() column1Movies: Movie[] = []
  @Input() column2Movies: Movie[] = []
  @Input() column3Movies: Movie[] = []
  @Input() column4Movies: Movie[] = []
  @Input() column5Movies: Movie[] = []
  @Input() favoriteMovies: Movie[] = []
  col1Movie: Movie | null = null

  constructor(private http: HttpClient, private readonly _modalReference: ModalReference<UserFavorites>, private readonly _modalService: ModalService) {
    
  }

  ngOnInit() {
    this.getHundredMovies()
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange['allMovies']) {
      this.allMovies = simpleChange['allMovies'].currentValue
    }
  }

  movieSelected() {
    console.log(this.favoriteMovies)
  }
  getHundredMovies() {
    
    this.http.get('http://localhost:8080/movies/get/all').subscribe((moviesList: any)=> {
      if (200) {
        this.allMovies.splice(0)
        this.column1Movies.splice(0)
        this.column2Movies.splice(0)
        this.column3Movies.splice(0)
        this.column4Movies.splice(0)
        this.column5Movies.splice(0)
        for (let i = 0; i < 300; i++) {
          
          let movie: Movie = new Movie(moviesList[i].ID, moviesList[i].Title, moviesList[i].OriginalLanguage,
            moviesList[i].Overview,"https://image.tmdb.org/t/p/w500" + moviesList[i].PosterPath, moviesList[i].ReleaseDate,
            moviesList[i].RuntimeMinutes, moviesList[i].UserScore, moviesList[i].Accuracy,
            moviesList[i].UserEntries)

          this.allMovies.push(movie)

          if (i < 2400)
            this.column1Movies.push(movie)

          else if (i < 4800)
            this.column2Movies.push(movie)

          else if (i < 7200)
            this.column3Movies.push(movie)

          else if (i < 9600)
            this.column4Movies.push(movie)

          else
            this.column5Movies.push(movie)
        }
        
    this.allMovies = [...this.allMovies]
    this.column1Movies = [...this.column1Movies]
    this.column2Movies = [...this.column2Movies]
    this.column3Movies = [...this.column3Movies]
    this.column4Movies = [...this.column4Movies]
    this.column5Movies = [...this.column5Movies]
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

  saveFavorites() {

    // send favorite movies
  }


}
