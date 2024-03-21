import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomUserMovieComponent } from './random-user-movie.component';

describe('RandomUserMovieComponent', () => {
  let component: RandomUserMovieComponent;
  let fixture: ComponentFixture<RandomUserMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomUserMovieComponent]
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
