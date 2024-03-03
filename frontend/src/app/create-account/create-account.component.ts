import { Component } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';

export interface newUser {

  fullName: string,
  username: string,
  password: string,

}
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {

  public newuser: newUser = {
    fullName: '',
    username: '',
    password: '',
  };

  constructor(private readonly _modalReference: ModalReference<newUser>) {}

  public cancel(): void {

    this._modalReference.cancel();
  }

  public saveData(): void {

    this._modalReference.closeSuccess(this.newuser);
  }

}
