///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ItemType } from '../../models/item-type';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  private _itemTypeSnapshot: SnapshotAction;
  @Input() itemType: ItemType;
  @Input() exclusive: boolean;
  object: AngularFireObject<any>;
  input: Observable<any>;
  checked: boolean;

  constructor(private db: AngularFireDatabase) {
  }

  get itemTypeSnapshot(): SnapshotAction {
    return this._itemTypeSnapshot;
  }

  @Input()
  set itemTypeSnapshot(itemTypeSnapshot: SnapshotAction) {
    this._itemTypeSnapshot = itemTypeSnapshot;
    this.itemType = itemTypeSnapshot.payload.val();
  }

  @Input()
  set inputRef(value: string) {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    this.object = this.db.object(value);
    this.input = this.object.snapshotChanges();
    this.subscription.add(this.input.subscribe(action => {
      console.log('item-type subscription');
      console.log(action);
      if (action.payload.exists()) {
        if (this.exclusive) {
          this.checked = this.itemTypeSnapshot.key === action.payload.val();
        } else {
          this.checked = action.payload.val();
        }
      } else {
        this.checked = false;
      }
    }));
  }

  get inputType() {
    return this.exclusive ? 'radio' : 'checkbox';
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
  }

  onInputChange(e) {
    this.checked = e.target.checked;
    if (this.exclusive) {
      if (this.checked) {
        this.object.set(this.itemTypeSnapshot.key).catch(console.log);
        // path should be /input/$input/$pizza/$itemCat
      }
    } else {
      this.object.set(this.checked ? this.checked : null).catch(console.log);
      // path should be /input/$input/$pizza/$itemCat/$itemType
    }
  }
}
