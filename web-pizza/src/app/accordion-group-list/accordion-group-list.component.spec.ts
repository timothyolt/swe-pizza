import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionGroupListComponent } from './accordion-group-list.component';

describe('AccordionGroupListComponent', () => {
  let component: AccordionGroupListComponent;
  let fixture: ComponentFixture<AccordionGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccordionGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
