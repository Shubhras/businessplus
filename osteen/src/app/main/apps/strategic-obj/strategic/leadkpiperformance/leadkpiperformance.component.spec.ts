import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadkpiperformanceComponent } from './leadkpiperformance.component';

describe('LeadkpiperformanceComponent', () => {
  let component: LeadkpiperformanceComponent;
  let fixture: ComponentFixture<LeadkpiperformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadkpiperformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadkpiperformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
