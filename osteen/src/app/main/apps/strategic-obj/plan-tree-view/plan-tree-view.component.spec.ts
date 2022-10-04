import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTreeViewComponent } from './plan-tree-view.component';

describe('PlanTreeViewComponent', () => {
  let component: PlanTreeViewComponent;
  let fixture: ComponentFixture<PlanTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanTreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
