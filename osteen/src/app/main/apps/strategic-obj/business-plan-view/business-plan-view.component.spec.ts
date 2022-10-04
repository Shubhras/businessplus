import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPlanViewComponent } from './business-plan-view.component';

describe('BusinessPlanViewComponent', () => {
  let component: BusinessPlanViewComponent;
  let fixture: ComponentFixture<BusinessPlanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessPlanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
