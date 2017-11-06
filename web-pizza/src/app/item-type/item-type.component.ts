///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component, Input, OnInit } from '@angular/core';
import { ItemType } from './item-type';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';

@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent implements OnInit {
  @Input() itemType: ItemType;
  @Input() exclusive: boolean;
  input: FirebaseObjectObservable<any>;
  checked: boolean;

  constructor(private db: AngularFireDatabase) {
  }

  @Input()
  set inputRef(value: string) {
    this.input = this.db.object(value);
    this.input.$ref.on('value', input => {
      if (input.exists()) {
        if (this.exclusive) {
          this.checked = this.itemType.id === input.val();
        } else {
          this.checked = input.val();
        }
      } else {
        this.checked = false;
      }
    });
  }

  get inputType() {
    return this.exclusive ? 'radio' : 'checkbox';
  }

  ngOnInit() {
  }

  onInputChange(e) {
    this.checked = e.target.checked;
    if (this.exclusive) {
      if (this.checked) {
        this.input.set(this.itemType.id);  // path should be /input/$input/$pizza/$itemCat
      }
    } else {
      this.input.set(this.checked ? this.checked : null);  // path should be /input/$input/$pizza/$itemCat/$itemType
    }
  }
}
