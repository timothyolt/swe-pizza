import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ItemCategory } from '../item-category/item-category';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  itemCats: FirebaseListObservable<ItemCategory[]>;

  constructor(db: AngularFireDatabase) {
    this.itemCats = db.list('/itemCat');
  }

  ngOnInit() {
  }

}
