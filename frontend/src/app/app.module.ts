import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderComponent } from './header/header.component';
import { LoginAccountComponent } from './login-account/login-account.component';
import { ModalModule } from '@developer-partners/ngx-modal-dialog';
import { CreateAccountComponent } from './create-account/create-account.component';
import { UserRecommendationsComponent } from './user-recommendations/user-recommendations.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginAccountComponent,
    CreateAccountComponent,
    UserRecommendationsComponent
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
