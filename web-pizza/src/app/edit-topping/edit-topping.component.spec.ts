import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditToppingComponent } from './edit-topping.component';

describe('EditToppingComponent', () => {
  let component: EditToppingComponent;
  let fixture: ComponentFixture<EditToppingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditToppingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditToppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
