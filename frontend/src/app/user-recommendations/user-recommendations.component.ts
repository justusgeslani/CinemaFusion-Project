import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { Movie } from 'src/schema/movie';

@Component({
  selector: 'app-user-recommendations',
  templateUrl: './user-recommendations.component.html',
  styleUrls: ['./user-recommendations.component.scss']
})
export class UserRecommendationsComponent {

  @Input() genreMovies: Movie[] = []
  @Input() movie: Movie = this._modalReference.config.model!
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

  isLoggedIn: boolean = false;
  constructor(private http: HttpClient, private readonly _modalReference: ModalReference<Movie>) {

    if (localStorage.getItem('UserName') != null)
      this.isLoggedIn = true;
  }
  

  ngOnInit() {
  }

  likeMovie(movie: Movie) {
    // Implement logic to handle liking the movie
    console.log('Liked:', movie.Title);
    // Sending movie ID and score 1 for like
    this.sendUserScore(movie.ID, 1);
  }

  dislikeMovie(movie: Movie) {
    // Implement logic to handle disliking the movie
    console.log('Disliked:', movie.Title);
    // Sending movie ID and score 0 for dislike
    this.sendUserScore(movie.ID, 0);
  }

  
  sendUserScore(movieId: number, score: number) {
    console.log("MOVIE ID: " + movieId)
    let userScore = { 
      "MovieID": movieId, 
      "MovieScore": score 
    };
    console.log('userScoreData:', userScore);
    
    const options = { headers: { 'Content-Type': 'application/json' } };
    this.http.post('http://localhost:8080/user/score', JSON.stringify(userScore), options).subscribe(
      (response: any) => {
        console.log('User score recorded successfully:', response);
        this._modalReference.closeSuccess()
      },
      (error) => {
        console.error('Error recording user response:', error);
        // Handle error appropriately (e.g., show error message to user)
      }
    );
  }

  addToFavorites(movie: Movie) {

  }
}
