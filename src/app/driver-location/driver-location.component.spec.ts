import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverLocationComponent } from './driver-location.component';

describe('DriverLocationComponent', () => {
  let component: DriverLocationComponent;
  let fixture: ComponentFixture<DriverLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
