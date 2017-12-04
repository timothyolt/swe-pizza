import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../models/order';
import { Observable } from 'rxjs/Observable';

/** Setup Angular component structure */
@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  /** Firebase reference for current order */
  orderRef: AngularFireObject<Order>;
  /** Observable list of order data */
  order: Observable<Order>;
  /** Observable list of ItemCatagories */
  itemCats: Observable<SnapshotAction[]>;
  /** Observable list of ItemTypes */
  itemTypes: Observable<SnapshotAction[]>;

  /** Initalize variables */
  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, private route: ActivatedRoute) { }

  /** 
   * Fetch order and topping data from Firebase
   * 
   * Called when Angular is ready 
  */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderRef = this.db.object('orders/' + id);
    this.order = this.orderRef.valueChanges().shareReplay(1);
    this.itemCats = this.db.list('itemCat').snapshotChanges().shareReplay(1);
    this.itemTypes = this.db.list('itemType').snapshotChanges().shareReplay(1);
  }

}
