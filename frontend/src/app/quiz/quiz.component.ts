import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserRecommendationsComponent } from '../user-recommendations/user-recommendations.component'

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
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('QuizComponent ngOnInit called');
  }

  getRecommendation(quizForm: NgForm) {
    const formValues = {
      weather: quizForm.value.weather,
      feelings: quizForm.value.feelings,
      gender: quizForm.value.gender,
      age: quizForm.value.age,
      time: quizForm.value.time,
      when: quizForm.value.when,
    };

    this.http.post<any>('http://localhost:8080/movies/byquiz/get', JSON.stringify(formValues))
      .subscribe((movie: any) => {
        console.log('Recommended Movie:', movie);
        this.recommendedMovie = movie; // Assign the recommended movie to the property
      }, (error) => {
        console.error('Error:', error);
      });
  }

  // private showRecommendationsModal(movie: any): void {
  //   this.modalService.show<UserRecommendationsComponent>(UserRecommendationsComponent, {
  //     title: 'Movie Recommendation',
  //     type: 'default',
  //     mode: 'disableFullScreen',
  //     model: movie // Pass the movie recommendation as model to the popup window
  //   });
  // }
}






  
  
  
  // private showRecommendationsModal(movie: any): void {
  //   this._modalService.show<Movie>(UserRecommendationsComponent, {
  //     title: 'Movie Recommendation',
  //     type: 'default',
  //     mode: 'disableFullScreen',  
  //   })
  // }

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




