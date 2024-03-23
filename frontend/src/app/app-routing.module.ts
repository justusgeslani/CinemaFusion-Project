import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component'; //new
import { QuizComponent } from './quiz/quiz.component'; // Import QuizComponent
import { GenrePageComponent } from './genre-page/genre-page.component'; // Import GenrePageComponent

const routes: Routes = [
  
  { path: 'header', component: HeaderComponent },
  { path: 'quiz', component: QuizComponent }, // Define route for QuizComponent
  { path: 'genre-page', component: GenrePageComponent }, // Define route for GenrePageComponent
  //{ path: '', redirectTo: '/header', pathMatch: 'full' }, // Redirect to /header if no matching route found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
