import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ItemType } from '../../models/item-type';

/** Setup Angular component structure */
@Component({
  selector: 'app-toppings-list',
  templateUrl: './toppings-list.component.html',
  styleUrls: ['./toppings-list.component.css']
})
export class ToppingsListComponent implements OnInit {
  /** Observable list of ItemType */
  itemTypes: Observable<ItemType[]>;

  /** Initalize AngularFireDatabase */
  constructor(private db: AngularFireDatabase) { }

  /** 
   * Fetch item types
   * 
   * Called when Angular is ready 
  */
  ngOnInit() {
    this.itemTypes = this.db.list('/itemType').snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

}
