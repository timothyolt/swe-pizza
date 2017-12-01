import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToppingCatListComponent } from './topping-cat-list.component';

describe('ToppingCatListComponent', () => {
  let component: ToppingCatListComponent;
  let fixture: ComponentFixture<ToppingCatListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToppingCatListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToppingCatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
