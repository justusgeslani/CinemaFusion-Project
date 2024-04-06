import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomUserMovieComponent } from './random-user-movie.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RandomUserMovieComponent', () => {
  let component: RandomUserMovieComponent;
  let fixture: ComponentFixture<RandomUserMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
    
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RandomUserMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
