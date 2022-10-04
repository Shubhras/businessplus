import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterActionPlanComponent } from './master-action-plan.component';

describe('MasterActionPlanComponent', () => {
  let component: MasterActionPlanComponent;
  let fixture: ComponentFixture<MasterActionPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterActionPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
