import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ItemType } from '../../models/item-type';

@Component({
  selector: 'app-toppings-list',
  templateUrl: './toppings-list.component.html',
  styleUrls: ['./toppings-list.component.css']
})
export class ToppingsListComponent implements OnInit {
  itemTypes: Observable<ItemType[]>;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.itemTypes = this.db.list('/itemType', ref =>
      ref.orderByValue()).valueChanges();
    this.itemTypes.subscribe(console.log);
  }

  // this.userRef = this.db.object('users/' + user.uid);
  // this.user = this.userRef.valueChanges();
  // this.userRef.query.ref.child('payMethods').once('value', payMethodsSnapshot => {
  //   if (payMethodsSnapshot.exists()) {
  //     const payMethods = payMethodsSnapshot.val();
  //     for (const key in payMethods) if (payMethods.hasOwnProperty(key)) {
  //       this.paymentRef = this.db.object('payMethods/' + key);
  //       this.payment = this.paymentRef.valueChanges();
  //       break;
  //       // todo support multiple payment methods
  //     }
  //   }
  // }).catch(console.log);

}
