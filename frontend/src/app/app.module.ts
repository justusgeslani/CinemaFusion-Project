import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { FrontPageComponent } from './front-page/front-page.component';
=======
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderComponent } from './header/header.component';
import { LoginAccountComponent } from './login-account/login-account.component';
import { ModalModule } from '@developer-partners/ngx-modal-dialog';
import { CreateAccountComponent } from './create-account/create-account.component';
import { UserRecommendationsComponent } from './user-recommendations/user-recommendations.component';
>>>>>>> d9799b809f4b0026a9d01af228760a4eabf2f762

@NgModule({
  declarations: [
    AppComponent,
<<<<<<< HEAD
    FrontPageComponent
=======
    HeaderComponent,
    LoginAccountComponent,
    CreateAccountComponent,
    UserRecommendationsComponent
>>>>>>> d9799b809f4b0026a9d01af228760a4eabf2f762
  ],
  imports: [
    BrowserModule,	  
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    ModalModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
