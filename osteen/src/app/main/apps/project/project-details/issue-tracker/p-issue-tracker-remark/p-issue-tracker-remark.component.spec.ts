import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PIssueTrackerRemarkComponent } from './p-issue-tracker-remark.component';

describe('PIssueTrackerRemarkComponent', () => {
  let component: PIssueTrackerRemarkComponent;
  let fixture: ComponentFixture<PIssueTrackerRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PIssueTrackerRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PIssueTrackerRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
