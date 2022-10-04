import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwotDataComponent } from './swot-data.component';

describe('SwotDataComponent', () => {
  let component: SwotDataComponent;
  let fixture: ComponentFixture<SwotDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwotDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwotDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
