import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';

/** Setup Angular component structure */
@Component({
  selector: 'app-past-orders',
  templateUrl: './past-orders.component.html',
  styleUrls: ['./past-orders.component.css']
})
export class PastOrdersComponent implements OnInit, OnDestroy {
  /** RXJS Observable subscription */
  subscription: Subscription;
  /** Observable list of all orders */
  orders: Observable<SnapshotAction[]>;
  /** Observable list of individual order details */
  orderDetails: {[key: string]: Observable<String>} = {};

  /** Initalize variables */
  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) { }

  /** 
   * Fetch user's orders
   * 
   * Called when Angular is ready 
  */
  ngOnInit() {
    this.subscription = this.auth.authState.subscribe(user => {
      if (user) {
        this.orders = this.db.list('users/' + user.uid + '/orders').snapshotChanges();
      }
    });
  }

  /** Unsubscribe when component is destroyed */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Fetch order creation date. Takes key of type string
   * @param key Order id
   * @returns {Observable}
   */
  orderName(key: string): Observable<String> {
    if (!this.orderDetails[key]) {
      this.orderDetails[key] = this.db.object('orders/' + key + '/createdAt').valueChanges();
    }
    return this.orderDetails[key];
  }

}
