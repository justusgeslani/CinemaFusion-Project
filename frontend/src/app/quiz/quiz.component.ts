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

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  constructor() {
    console.log('QuizComponent constructor called');
  }
    
  ngOnInit(): void {
    // Logic to be executed on component initialization
    console.log('QuizComponent ngOnInit called');
  }

  getRecommendation() {
    // Logic to get recommendation
  }
}

