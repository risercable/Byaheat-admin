import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversMapComponent } from './drivers-map.component';

describe('DriversMapComponent', () => {
  let component: DriversMapComponent;
  let fixture: ComponentFixture<DriversMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
