///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component, Input, OnInit } from '@angular/core';
import { ItemType } from './item-type';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent implements OnInit {

  @Input() itemType: ItemType;

  constructor() {
  }

  ngOnInit() {
  }

}
