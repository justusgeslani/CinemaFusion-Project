import { Component } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { NgForm } from '@angular/forms';

export interface User {
  username: string,
  password: string,
}
@Component({
  selector: 'app-login-account',
  templateUrl: './login-account.component.html',
  styleUrls: ['./login-account.component.css']
})
export class LoginAccountComponent {

  title="Login Site";
  allLogins: LoginTest[] = []

  constructor(private http: HttpClient, private readonly _modalReference: ModalReference<User>, private readonly _modalService: ModalService) {
    
  }

  ngOnInit(){
    this.getLogins();
  }

  loginUser(f: NgForm){

    let loginUsername = f.value.loginUsername
    let loginPassword = f.value.loginPassword

    console.log(this.title)

    let loginTest = {
      "Username": loginUsername,
      "Password": loginPassword,
    }

  };

  getLogins() {

  }


  public user: User = {
    username: '',
    password: '',
  };


  public createAccount(): void {
    
    this._modalService.show<User>(CreateAccountComponent, {
      title: 'Become a CinemaFusion Member',
      mode: 'disableFullScreen',
      type: 'default',
    })
  }

  public cancel(): void {

    this._modalReference.cancel();
  }

  public saveData(): void {

    this._modalReference.closeSuccess(this.user);
  }

}

class LoginTest {
  LoginUsername: string;
  LoginPassword: string;

  constructor(loginUsername:string, loginPassword:string) {
    this.LoginUsername=loginUsername;
    this.LoginPassword=loginPassword;
  }

}
