import { Component, HostBinding, Input } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap';

/** Setup Angular component structure */
@Component({
  selector: 'app-accordion-group-list',
  templateUrl: './accordion-group-list.component.html',
  styleUrls: ['./accordion-group-list.component.css']
})
export class AccordionGroupListComponent extends AccordionPanelComponent {
  /** Bind css value */
  @HostBinding('class') panelClass: 'panel';
  /** Bind css value */
  @HostBinding('style') style: 'display: block';

  /** Setup NGX-Boostrap Accordion component */
  constructor(accordion: AccordionComponent) {
    super(accordion);
  }

}
