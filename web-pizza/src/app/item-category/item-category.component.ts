import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ItemType } from '../../models/item-type';
import { ItemCategory } from '../../models/item-category';
import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.css']
})
export class ItemCategoryComponent implements OnInit {
  @Input() pizzaRef: string;
  itemTypeSnapshots: Observable<SnapshotAction[]>;

  constructor(private db: AngularFireDatabase) {
  }

  private _itemCatSnapshot: SnapshotAction;
  itemCat: ItemCategory;

  get itemCatSnapshot(): SnapshotAction {
    return this._itemCatSnapshot;
  }

  @Input()
  set itemCatSnapshot(itemCatSnapshot: SnapshotAction) {
    this._itemCatSnapshot = itemCatSnapshot;
    this.itemCat = itemCatSnapshot.payload.val();
    this.itemTypeSnapshots = this.db.list('/itemType', ref => ref.orderByChild('cat')
        .equalTo(this.itemCatSnapshot && this.itemCatSnapshot.key ? this.itemCatSnapshot.key : null)).snapshotChanges();
  }

  ngOnInit() {
  }

}
