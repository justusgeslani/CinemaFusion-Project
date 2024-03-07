import { Component } from '@angular/core';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import { LoginAccountComponent } from '../login-account/login-account.component';

export interface User{
  username: string,
  password: string,
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private readonly _modalService: ModalService) {

  }

  public openUserAccount(): void {

    this._modalService.show<User>(LoginAccountComponent, {
      title: 'Login / Create Account',
      mode: 'fullScreen',
      type: 'default',
    })

  }

  openSearch(){

  }


}
