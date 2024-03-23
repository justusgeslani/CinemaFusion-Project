import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {
  currentDate: string = '';

  constructor() { }

  ngOnInit(): void {
    this.setCurrentDate();
  }

  setCurrentDate(): void {
    const today = new Date();
    this.currentDate = today.toDateString();
  }
}

