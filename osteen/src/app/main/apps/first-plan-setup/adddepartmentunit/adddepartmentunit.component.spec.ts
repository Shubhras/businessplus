import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddepartmentunitComponent } from './adddepartmentunit.component';

describe('AdddepartmentunitComponent', () => {
  let component: AdddepartmentunitComponent;
  let fixture: ComponentFixture<AdddepartmentunitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdddepartmentunitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddepartmentunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
