import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditToppingCatComponent } from './edit-topping-cat.component';

describe('EditToppingCatComponent', () => {
  let component: EditToppingCatComponent;
  let fixture: ComponentFixture<EditToppingCatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditToppingCatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditToppingCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
