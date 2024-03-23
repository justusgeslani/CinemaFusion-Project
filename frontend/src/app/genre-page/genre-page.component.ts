import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.component.html',
  styleUrls: ['./genre-page.component.css']
})

export class GenrePageComponent implements OnInit {

  constructor() {
    console.log('GenrePageComponent constructor called');
  }
    
  ngOnInit(): void {
    // Logic to be executed on component initialization
    console.log('GenrePageComponent ngOnInit called');
  }

  getRecommendationByGenre() {
    // Logic to get recommendation and display the result in the 'result' div
  }
}
