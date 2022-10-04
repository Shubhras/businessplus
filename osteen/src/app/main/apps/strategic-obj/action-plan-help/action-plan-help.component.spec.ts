import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanHelpComponent } from './action-plan-help.component';

describe('ActionPlanHelpComponent', () => {
  let component: ActionPlanHelpComponent;
  let fixture: ComponentFixture<ActionPlanHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPlanHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
