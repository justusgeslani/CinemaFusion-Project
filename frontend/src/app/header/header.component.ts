import { Component } from '@angular/core';
import { ModalService } from '@developer-partners/ngx-modal-dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private readonly _modalService: ModalService) {

  }

  openUserAccount(){

  }

  openSearch(){

  }


}
