import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import { UserRecommendationsComponent } from '../user-recommendations/user-recommendations.component';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  recommendedMovie: any; // Define a property to hold the recommended movie

  weather: string | null = null;
  feeling: string | null = null;
  gender: string | null = null;
  age: string | null = null;
  time: string | null = null;
  when: string | null = null;

  constructor(private modalService: ModalService, private http: HttpClient) {}

  ngOnInit(): void {
    console.log('QuizComponent ngOnInit called');
  }

  getRecommendation(quizForm?: NgForm): void {
    const FormValues = quizForm ? {
      weather: quizForm.value.weather,
      feelings: quizForm.value.feelings,
      gender: quizForm.value.gender,
      age: quizForm.value.age,
      time: quizForm.value.time,
      when: quizForm.value.when,
    }: {};

    this.http.post<any>('http://localhost:8080/movies/byquiz/get', JSON.stringify(FormValues))
      .subscribe((moviesList: any) => {
        console.log('Recommended Movie:', moviesList);
        console.log('API Response:', moviesList);
        const cleanResponse = moviesList.replace(/\n/g, "").replace(/\\/g, "");
        // Parse the cleaned response string into object
        this.recommendedMovie = JSON.parse(cleanResponse);

        // Display the movie recommendation in a modal window
       // this.openModal(this.recommendedMovie);
      }, (error) => {
        console.error('Error:', error);
      });
      
  }

  resetForm(): void {
    this.weather = null;
    this.feeling = null;
    this.gender = null;
    this.age = null;
    this.time = null;
    this.when = null;
    this.recommendedMovie = null;
    this.showFeedbackMessage = false; // Hide the feedback message
  }
  
  showFeedbackMessage: boolean = false;

  likeMovie() {
    console.log('Liked:', this.recommendedMovie.title);
    this.sendUserScore(this.recommendedMovie.id, 1);
    this.showFeedbackMessage = true; // Show the feedback message
  }

  dislikeMovie(): void {
    console.log('Disliked:', this.recommendedMovie.title);
    this.sendUserScore(this.recommendedMovie.id, -1);
    this.getRecommendation(); // Get another recommendation when the user dislikes
    this.showFeedbackMessage = false; // Hide the feedback message
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
      },
      (error) => {
        console.error('Error recording user response:', error);
      }
    );
  }




  openModal(recommendedMovie: any): void {
    console.log('Recommended Movie in modal function:', recommendedMovie); // Log the movie info
    this.modalService.show(UserRecommendationsComponent, {
      title: 'Movie Recommendation',
      type: 'default',
      mode: 'disableFullScreen',
      model: recommendedMovie // Pass the recommended movie as model to the popup window
    });
  }
}






// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';

// @Component({
//   selector: 'app-quiz',
//   templateUrl: './quiz.component.html',
//   styleUrls: ['./quiz.component.css']
// })
// export class QuizComponent implements OnInit {
  
//   constructor(private http: HttpClient) {

//   }
    
//   ngOnInit(): void {
//     // Logic to be executed on component initialization
//     console.log('QuizComponent ngOnInit called');
//   }

//   getRecommendation(quizForm: NgForm) {
//     // Logic to get recommendation
//     // Get form values
    
//     const FormValues = {
//       weather: quizForm.value.weather,
//       feelings: quizForm.value.feelings,
//       gender: quizForm.value.gender,
//       age: quizForm.value.age,
//       time: quizForm.value.time,
//       when: quizForm.value.when,
//     };
    

//     // console.log(FormValues)
//     this.http.post('http://localhost:8080/movies/byquiz/get', JSON.stringify(FormValues)).subscribe((moviesList: any)=> {
//         if (200) {
//           var movie = JSON.parse(moviesList)
//           console.log(movie)  //parse 'movie' to print on UI
//         }
//       }, (error) => {
//         if (error.status === 404) {
//           alert('Resource not found.');
//         }
//         else if (error.status === 403) {
//           alert('Forbidden Access to Resource');
//         }
//         else if (error.status === 500) {
//           alert('Server down.');
//         }
//         else if (error.status === 502) {
//           alert('Bad gateway.');
//         }
//       }
      
//     );

//   }
// }




