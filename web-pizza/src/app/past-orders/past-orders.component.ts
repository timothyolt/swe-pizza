import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-past-orders',
  templateUrl: './past-orders.component.html',
  styleUrls: ['./past-orders.component.css']
})
export class PastOrdersComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  orders: Observable<SnapshotAction[]>;
  orderDetails: {[key: string]: Observable<String>} = {};

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) { }

  ngOnInit() {
    this.subscription = this.auth.authState.subscribe(user => {
      if (user) {
        this.orders = this.db.list('users/' + user.uid + '/orders').snapshotChanges();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  orderName(key: string): Observable<String> {
    if (!this.orderDetails[key]) {
      this.orderDetails[key] = this.db.object('orders/' + key + '/createdAt').valueChanges();
    }
    return this.orderDetails[key];
  }

}
