import { Component } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { NgForm } from '@angular/forms';

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

  title="New User Site";
  allNewUsers: NewUserTest[] = []

  constructor(private http: HttpClient, private readonly _modalReference: ModalReference<newUser>) {}

  ngOnInit(){
    this.getNewUsers();
  }

  createUser(f: NgForm){

    let newFullName = f.value.newFullName
    let newUsername = f.value.newUsername
    let newPassword = f.value.newPassword

    console.log(this.title)

    let newUserTest = {
      "NewFullName": newFullName,
      "NewUsername": newUsername,
      "NewPassword": newPassword,
    }

  };

  getNewUsers() {

  }

  public newuser: newUser = {
    fullName: '',
    username: '',
    password: '',
  };

  public cancel(): void {

    this._modalReference.cancel();
  }

  public saveData(): void {

    this._modalReference.closeSuccess(this.newuser);
  }

}

class NewUserTest {
  NewFullName: string;
  NewUsername: string;
  NewPassword: string;

  constructor(newFullName: string, newUsername:string, newPassword:string) {
    this.NewFullName=newFullName;
    this.NewUsername=newUsername;
    this.NewPassword=newPassword;
  }

}
