import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitsHistoryComponent } from './remits-history.component';

describe('RemitsHistoryComponent', () => {
  let component: RemitsHistoryComponent;
  let fixture: ComponentFixture<RemitsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
