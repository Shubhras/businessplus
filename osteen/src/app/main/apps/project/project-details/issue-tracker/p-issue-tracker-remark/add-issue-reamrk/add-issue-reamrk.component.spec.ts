import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssueReamrkComponent } from './add-issue-reamrk.component';

describe('AddIssueReamrkComponent', () => {
  let component: AddIssueReamrkComponent;
  let fixture: ComponentFixture<AddIssueReamrkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIssueReamrkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIssueReamrkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
