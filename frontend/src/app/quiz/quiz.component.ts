// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-quiz',
//   //standalone: true,
//   //imports: [],
//   templateUrl: './quiz.component.html',
//   styleUrls: ['./quiz.component.css']
// })
// export class QuizComponent {

//   constructor() { }

//   getRecommendation() {
//     // Implement logic to get recommendation
//     // and display the result in the 'result' div
//   }

// }

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  
  constructor(private http: HttpClient) {

  }
    
  ngOnInit(): void {
    // Logic to be executed on component initialization
    console.log('QuizComponent ngOnInit called');
  }

  getRecommendation(quizForm: NgForm) {
    // Logic to get recommendation
    // Get form values
    
    const FormValues = {
      weather: quizForm.value.weather,
      feelings: quizForm.value.feelings,
      gender: quizForm.value.gender,
      age: quizForm.value.age,
      time: quizForm.value.time,
      when: quizForm.value.when,
    };
    

    // console.log(FormValues)
    this.http.post('http://localhost:8080/movies/byquiz/get', JSON.stringify(FormValues)).subscribe((moviesList: any)=> {
        if (200) {
          var movie = JSON.parse(moviesList)
          console.log(movie)  //parse 'movie' to print on UI
        }
      }, (error) => {
        if (error.status === 404) {
          alert('Resource not found.');
        }
        else if (error.status === 403) {
          alert('Forbidden Access to Resource');
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
}

