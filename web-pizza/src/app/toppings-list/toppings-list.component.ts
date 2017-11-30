import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ItemType } from '../../models/item-type';

@Component({
  selector: 'app-toppings-list',
  templateUrl: './toppings-list.component.html',
  styleUrls: ['./toppings-list.component.css']
})
export class ToppingsListComponent implements OnInit {
  itemTypes: Observable<ItemType[]>;  

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.itemTypes = this.db.list('/itemType', ref =>
      ref.orderByValue()).valueChanges();
    this.itemTypes.subscribe(console.log);
  }

}
