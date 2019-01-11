import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotcComponent } from './notc.component';

describe('NotcComponent', () => {
  let component: NotcComponent;
  let fixture: ComponentFixture<NotcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
