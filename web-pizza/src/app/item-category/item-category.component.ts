import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ItemType } from '../item-type/item-type';
import { ItemCategory } from './item-category';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.css']
})
export class ItemCategoryComponent implements OnInit {
  constructor(db: AngularFireDatabase) {
    this.db = db;
  }

  private db: AngularFireDatabase;

  private _itemCat: ItemCategory;

  @Input()
  set itemCat(itemCat: ItemCategory) {
    this._itemCat = itemCat;
    this.itemTypes = this.db.list('/itemType', {
      query: {
        orderByChild: 'cat',
        equalTo: this.itemCat && this.itemCat.id ? this.itemCat.id : null
      }
    });
  }

  get itemCat(): ItemCategory { return this._itemCat; }

  itemTypes: FirebaseListObservable<ItemType[]>;

  ngOnInit() {
  }

}
