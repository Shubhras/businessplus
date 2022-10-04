import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicGroupByComponent } from './strategic-group-by.component';

describe('StrategicGroupByComponent', () => {
  let component: StrategicGroupByComponent;
  let fixture: ComponentFixture<StrategicGroupByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategicGroupByComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategicGroupByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
