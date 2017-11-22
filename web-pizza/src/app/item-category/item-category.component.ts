import { Component, Input, OnInit } from '@angular/core';
import { ItemType } from '../item-type/item-type';
import { ItemCategory } from './item-category';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.css']
})
export class ItemCategoryComponent implements OnInit {
  @Input() pizzaRef: string;
  itemTypes: Observable<ItemType[]>;

  constructor(private db: AngularFireDatabase) {
  }

  private _itemCat: ItemCategory;

  get itemCat(): ItemCategory { return this._itemCat; }

  @Input()
  set itemCat(itemCat: ItemCategory) {
    this._itemCat = itemCat;
    this.itemTypes = this.db.list('/itemType', ref =>
      ref.orderByChild('cat').equalTo(this.itemCat && this.itemCat.id ? this.itemCat.id : null)).valueChanges();
    this.itemTypes.subscribe(console.log);
  }

  ngOnInit() {
  }

}
