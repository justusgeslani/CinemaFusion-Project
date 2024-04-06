import { Component, Input } from '@angular/core';
import { Movie } from 'src/schema/movie';
import { ModalReference } from "@developer-partners/ngx-modal-dialog";

@Component({
  selector: 'app-genres-popup',
  templateUrl: './genres-popup.component.html',
  styleUrl: './genres-popup.component.scss'
})
export class GenresPopupComponent {
  @Input() genres: Movie[] = []
  
  constructor(private readonly _modalReference: ModalReference<Movie[], string[]>) {
    this.genres = this._modalReference.config.model!;
  }
  
}
