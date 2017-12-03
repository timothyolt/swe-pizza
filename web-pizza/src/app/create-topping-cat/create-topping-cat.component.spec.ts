import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateToppingCatComponent } from './create-topping-cat.component';

describe('CreateToppingCatComponent', () => {
  let component: CreateToppingCatComponent;
  let fixture: ComponentFixture<CreateToppingCatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateToppingCatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateToppingCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
