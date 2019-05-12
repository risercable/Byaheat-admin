import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitsComponent } from './remits.component';

describe('RemitsComponent', () => {
  let component: RemitsComponent;
  let fixture: ComponentFixture<RemitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
