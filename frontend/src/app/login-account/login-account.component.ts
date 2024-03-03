import { Component } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';

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

  public user: User = {
    username: '',
    password: '',
  };

  constructor(private readonly _modalReference: ModalReference<User>) {
    
  }

  public createAccount(): void {
    
  }

  public cancel(): void {

    this._modalReference.cancel();
  }

  public saveData(): void {

    this._modalReference.closeSuccess(this.user);
  }

}
