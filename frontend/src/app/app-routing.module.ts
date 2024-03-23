import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component'; //new
import { QuizComponent } from './quiz/quiz.component'; // Import QuizComponent
import { FrontPageComponent } from './front-page/front-page.component';

const routes: Routes = [
  
  { path: 'header', component: HeaderComponent },
  { path: 'frontPage', component: FrontPageComponent},
  { path: 'quiz', component: QuizComponent }, // Define route for QuizComponent
  //{ path: '', redirectTo: '/header', pathMatch: 'full' }, // Redirect to /header if no matching route found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
