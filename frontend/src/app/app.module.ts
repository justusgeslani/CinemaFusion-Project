import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; //new

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FrontPageComponent } from './front-page/front-page.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderComponent } from './header/header.component';
import { LoginAccountComponent } from './login-account/login-account.component';
import { ModalModule } from '@developer-partners/ngx-modal-dialog';
import { CreateAccountComponent } from './create-account/create-account.component';
import { UserRecommendationsComponent } from './user-recommendations/user-recommendations.component';
import { QuizComponent } from './quiz/quiz.component'; // Import QuizComponent
import { MovieOverviewComponent } from './movie-overview/movie-overview.component';
import { GenrePageComponent } from './genre-page/genre-page.component'; // import genrePage component
import { RandomUserMovieComponent } from './random-user-movie/random-user-movie.component'; // 4/2 added

@NgModule({
  declarations: [
    AppComponent,
    FrontPageComponent,
    HeaderComponent,
    LoginAccountComponent,
    CreateAccountComponent,
    QuizComponent, 
    GenrePageComponent,
    RandomUserMovieComponent, // 4/2 added
    UserRecommendationsComponent,
    MovieOverviewComponent
  ],
  imports: [
    BrowserModule,	  
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    ModalModule,
    RouterModule.forRoot([
      // Define routes here
      { path: 'quiz', component: QuizComponent }, // Example route for QuizComponent
      // Add more routes as needed
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
