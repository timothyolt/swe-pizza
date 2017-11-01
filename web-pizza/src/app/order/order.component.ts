import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ItemCategory } from '../item-category/item-category';
import { Order } from './order';
import { Pizza } from '../pizza/pizza';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderRef: string;
  order: FirebaseObjectObservable<Order>;
  pizzas: FirebaseListObservable<Pizza[]>;
  itemCats: FirebaseListObservable<ItemCategory[]>;

  constructor(db: AngularFireDatabase) {
    db.database.ref('/users/development').once('value', user => {
      if (user.exists() && user.val().activeOrder) {
        const val = user.val();
        this.orderRef = '/orders/' + val.activeOrder;
        this.order = db.object(this.orderRef);
        this.pizzas = db.list(this.orderRef + '/pizzas');
      } else {
        const order = new Order();
        order.createdAtDate = new Date();
        const orderId: string = db.database.ref('/orders').push(order).key;
        db.database.ref('/users/development').update({activeOrder: orderId});
        this.orderRef = '/orders/' + orderId;
        this.order = db.object(this.orderRef);
        this.order.update({ id: orderId });
        this.pizzas = db.list(this.orderRef + '/pizzas');
        db.database.ref('/defaultPizza').once(
          'value',
          defaultPizza => this.order.update({pizzas: defaultPizza.exists() ? [defaultPizza.val()] : null}));
      }
    });
    this.itemCats = db.list('/itemCat');
  }

  ngOnInit() {
  }

}
