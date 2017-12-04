import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ItemType } from '../../models/item-type';
import { ItemCategory } from '../../models/item-category';
import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

/** Setup Angular component structure */
@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.css']
})
export class ItemCategoryComponent implements OnInit {
  /** Holds Pizza Firebase reference from HTML property */
  @Input() pizzaRef: string;
  /** Observable list of ItemType snapshots */
  itemTypeSnapshots: Observable<SnapshotAction[]>;

  /** Initalize AngularFireDatabase */
  constructor(private db: AngularFireDatabase) {
  }

  /** Holds snapshot from HTML property */
  private _itemCatSnapshot: SnapshotAction;
  /** Data-bound model of ItemCategory */
  itemCat: ItemCategory;

  /** Get data from HTML property */
  get itemCatSnapshot(): SnapshotAction {
    return this._itemCatSnapshot;
  }

  /** Reflect changes back to HTML property */
  @Input()
  set itemCatSnapshot(itemCatSnapshot: SnapshotAction) {
    this._itemCatSnapshot = itemCatSnapshot;
    this.itemCat = itemCatSnapshot.payload.val();
    this.itemTypeSnapshots = this.db.list('/itemType', ref => ref.orderByChild('cat')
        .equalTo(this.itemCatSnapshot && this.itemCatSnapshot.key ? this.itemCatSnapshot.key : null)).snapshotChanges();
  }

  /** Called when Angular is ready */
  ngOnInit() {
  }

}
