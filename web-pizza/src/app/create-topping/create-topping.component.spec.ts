import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateToppingComponent } from './create-topping.component';

describe('CreateToppingComponent', () => {
  let component: CreateToppingComponent;
  let fixture: ComponentFixture<CreateToppingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateToppingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateToppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
