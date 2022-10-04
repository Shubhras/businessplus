import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteparticipantComponent } from './deleteparticipant.component';

describe('DeleteparticipantComponent', () => {
  let component: DeleteparticipantComponent;
  let fixture: ComponentFixture<DeleteparticipantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteparticipantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteparticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
