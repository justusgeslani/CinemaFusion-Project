import { Component } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import { CreateAccountComponent } from '../create-account/create-account.component';

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

  constructor(private readonly _modalReference: ModalReference<User>, private readonly _modalService: ModalService) {
    
  }

  public createAccount(): void {
    
    this._modalService.show<User>(CreateAccountComponent, {
      title: 'Become a CinemaFusion Member',
      mode: 'disableFullScreen',
      type: 'warning',
    })
  }

  public cancel(): void {

    this._modalReference.cancel();
  }

  public saveData(): void {

    this._modalReference.closeSuccess(this.user);
  }

}
