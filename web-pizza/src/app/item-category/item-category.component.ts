import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ItemType } from '../item-type/item-type';
import { ItemCategory } from './item-category';
import { Pizza } from '../pizza/pizza';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.css']
})
export class ItemCategoryComponent implements OnInit {
  @Input() pizzaRef: string;
  itemTypes: FirebaseListObservable<ItemType[]>;

  constructor(private db: AngularFireDatabase) {
  }

  private _itemCat: ItemCategory;

  get itemCat(): ItemCategory { return this._itemCat; }

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

  ngOnInit() {
  }

}
