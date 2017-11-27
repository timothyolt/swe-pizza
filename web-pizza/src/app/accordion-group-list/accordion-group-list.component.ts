import { Component, HostBinding, Input } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-accordion-group-list',
  templateUrl: './accordion-group-list.component.html',
  styleUrls: ['./accordion-group-list.component.css']
})
export class AccordionGroupListComponent extends AccordionPanelComponent {
  @HostBinding('class') panelClass: 'panel';
  @HostBinding('style') style: 'display: block';

  constructor(accordion: AccordionComponent) {
    super(accordion);
  }

}
