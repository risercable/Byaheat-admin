import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversTableComponent } from './drivers-table.component';

describe('DriversTableComponent', () => {
  let component: DriversTableComponent;
  let fixture: ComponentFixture<DriversTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
