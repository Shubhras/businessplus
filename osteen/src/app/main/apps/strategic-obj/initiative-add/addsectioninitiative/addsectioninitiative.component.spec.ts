import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsectioninitiativeComponent } from './addsectioninitiative.component';

describe('AddsectioninitiativeComponent', () => {
  let component: AddsectioninitiativeComponent;
  let fixture: ComponentFixture<AddsectioninitiativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsectioninitiativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsectioninitiativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
