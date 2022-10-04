import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueReamrkComponent } from './edit-issue-reamrk.component';

describe('EditIssueReamrkComponent', () => {
  let component: EditIssueReamrkComponent;
  let fixture: ComponentFixture<EditIssueReamrkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIssueReamrkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssueReamrkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
