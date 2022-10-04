import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEventsComponent } from './task-events.component';

describe('TaskEventsComponent', () => {
  let component: TaskEventsComponent;
  let fixture: ComponentFixture<TaskEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
