import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPizzaComponent } from './edit-pizza.component';

describe('EditPizzaComponent', () => {
  let component: EditPizzaComponent;
  let fixture: ComponentFixture<EditPizzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPizzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPizzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
