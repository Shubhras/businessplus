import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpidetailsComponent } from './kpidetails.component';

describe('KpidetailsComponent', () => {
  let component: KpidetailsComponent;
  let fixture: ComponentFixture<KpidetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpidetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpidetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
