import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
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
  pizzas: Pizza[] = [];
  itemCats: FirebaseListObservable<ItemCategory[]>;

  constructor(db: AngularFireDatabase) {
    db.database.ref('/users/development').once('value', user => {
      if (user.exists() && user.val().activeOrder) {
        this.orderRef = '/orders/' + user.val().activeOrder;
      } else {
        const order = new Order();
        order.createdAtDate = new Date();
        const orderId: string = db.database.ref('/orders').push(order).key;
        db.database.ref('/users/development').update({activeOrder: orderId});
        this.orderRef = '/orders/' + orderId;
        db.database.ref(this.orderRef).update({ id: orderId });
        db.database.ref('/defaultPizza').once(
          'value',
          defaultPizza => {
            this.pizzas = defaultPizza.exists() ? [defaultPizza.val()] : [];
            db.database.ref(this.orderRef).update({pizzas: this.pizzas});
          });
      }
      db.database.ref(this.orderRef + '/pizzas').on('child_added', pizza => {
        // this.pizzas.splice(Number(pizza.key), 0, pizza.val());
        const pizzaVal = pizza.val();
        pizzaVal['$key'] = pizza.key;
        this.pizzas.push(pizzaVal);
      });
      db.database.ref(this.orderRef + '/pizzas').on('child_removed', pizza => {
        this.pizzas.splice(Number(pizza.key), 1);
      });
    });
    this.itemCats = db.list('/itemCat');
  }

  ngOnInit() {
  }

}
