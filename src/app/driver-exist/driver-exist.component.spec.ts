import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverExistComponent } from './driver-exist.component';

describe('DriverExistComponent', () => {
  let component: DriverExistComponent;
  let fixture: ComponentFixture<DriverExistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverExistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
