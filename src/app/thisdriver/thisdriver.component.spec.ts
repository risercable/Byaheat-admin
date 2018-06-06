import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThisdriverComponent } from './thisdriver.component';

describe('ThisdriverComponent', () => {
  let component: ThisdriverComponent;
  let fixture: ComponentFixture<ThisdriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThisdriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThisdriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
