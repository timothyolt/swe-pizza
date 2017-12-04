///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ItemType } from '../../models/item-type';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

/** Setup Angular component structure */
@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent implements OnInit, OnDestroy {
  /** RXJS Observable subscription */
  subscription = new Subscription();
  /** Firebase snapshot of ItemType */
  private _itemTypeSnapshot: SnapshotAction;
  /** Holds ItemType from HTML property */
  @Input() itemType: ItemType;
  /** Holds boolean from HTML property */
  @Input() exclusive: boolean;
  /** Unproccessed object from Firebase */
  object: AngularFireObject<any>;
  /** Observable list of snapshots */
  input: Observable<any>;
  /** Holds whether a topping is exclusive or not */
  checked: boolean;

  /** Initalize AngularFireDatabase */
  constructor(private db: AngularFireDatabase) {
  }

  /** Get snapshot value from HTML property */
  get itemTypeSnapshot(): SnapshotAction {
    return this._itemTypeSnapshot;
  }

  /** 
   * Relect snapshot value to HTML property 
   * @param {SnapshotAction} itemTypeSnapshot SnapshotAction from HTML property
   * */
  @Input()
  set itemTypeSnapshot(itemTypeSnapshot: SnapshotAction) {
    this._itemTypeSnapshot = itemTypeSnapshot;
    this.itemType = itemTypeSnapshot.payload.val();
  }

  /** 
     * Relect Firebase reference to HTML property 
     * @param {string} value Firebase reference from HTML property
     * */
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

  /** Get boolean from HTML property */
  get inputType() {
    return this.exclusive ? 'radio' : 'checkbox';
  }

  /** Called when Angular is ready */
  ngOnInit() {
  }

  /** Called when component is destroyed */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
  }

  /** Event listener method when checkbox changes value */
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
