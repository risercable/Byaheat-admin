import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatespageComponent } from './ratespage.component';

describe('RatespageComponent', () => {
  let component: RatespageComponent;
  let fixture: ComponentFixture<RatespageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatespageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatespageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
