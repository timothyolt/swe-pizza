import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ItemCategory } from '../../models/item-category';

/** Setup Angular component structure */
@Component({
  selector: 'app-topping-cat-list',
  templateUrl: './topping-cat-list.component.html',
  styleUrls: ['./topping-cat-list.component.css']
})
export class ToppingCatListComponent implements OnInit {
  /** Observable list of ItemCatagory */
  itemCats: Observable<ItemCategory[]>;

  /** Initalize AngularFireDatabase */
  constructor(private db: AngularFireDatabase) { }

  /** 
   * Fetch item categories
   * 
   * Called when Angular is ready 
  */
  ngOnInit() {
    this.itemCats = this.db.list('/itemCat').snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

}
