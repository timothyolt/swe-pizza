import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
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

  constructor(private db: AngularFireDatabase) {
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
        this.addNewPizza(null);
      }
      db.database.ref(this.orderRef + '/pizzas').on('child_added', pizza => {
        if (!this.pizzas) {
          this.pizzas = [];
        }
        const pizzaVal = pizza.val();
        pizzaVal['$key'] = pizza.key;
        this.pizzas.splice(Number(pizza.key), 0, pizzaVal);
      });
      db.database.ref(this.orderRef + '/pizzas').on('child_removed', pizza => {
        this.pizzas.splice(Number(pizza.key), 1);
      });
      db.database.ref(this.orderRef + '/pizzas').on('child_moved', pizza => {
        // this.pizzas.splice(Number(pizza.key), 1);
        console.log('moved');
      });
    });
    this.itemCats = db.list('/itemCat');
  }

  ngOnInit() {
  }

  addNewPizza(e) {
    this.db.database.ref('/defaultPizza').once(
      'value',
      defaultPizza => {
        this.db.database.ref(this.orderRef).child('pizzas').transaction(pizzas => {
          if (pizzas) {
            pizzas.push(defaultPizza.val());
          } else {
            pizzas = [defaultPizza.val()];
          }
          return pizzas;
        });
      });
  }
}
