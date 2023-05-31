import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnLoopComponent } from './learn-loop.component';

describe('LearnLoopComponent', () => {
  let component: LearnLoopComponent;
  let fixture: ComponentFixture<LearnLoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnLoopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnLoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
