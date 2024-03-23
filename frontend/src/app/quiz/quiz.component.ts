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

  getRecommendationByQuiz() {
    // Logic to get recommendation
  }
}

