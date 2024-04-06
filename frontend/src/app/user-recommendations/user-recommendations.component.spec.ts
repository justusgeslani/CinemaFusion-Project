import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecommendationsComponent } from './user-recommendations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserRecommendationsComponent', () => {
  let component: UserRecommendationsComponent;
  let fixture: ComponentFixture<UserRecommendationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRecommendationsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserRecommendationsComponent, useValue: {} },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    });
    fixture = TestBed.createComponent(UserRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
