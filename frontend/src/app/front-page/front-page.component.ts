import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {
  currentDate: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setCurrentDate();
    if (this.isSignedIn() === false)
      this.router.navigateByUrl("/")
  }
  
  isSignedIn() {
    if (localStorage.getItem('UserName') != null) 
      return true;

    else
      return false;
  }

  setCurrentDate(): void {
    const today = new Date();
    this.currentDate = today.toDateString();
  }
}

