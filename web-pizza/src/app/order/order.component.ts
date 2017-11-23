import { Component, OnInit} from '@angular/core';
import { ItemCategory } from '../../models/item-category';
import { Order } from '../../models/order';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderRef: string;
  cost: Observable<number>;
  total: Observable<number>;
  pizzas: Pizza[] = [];
  itemCats: Observable<ItemCategory[]>;

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
        db.database.ref(this.orderRef).update({ id: orderId }).catch(console.log);
        this.addNewPizza(null);
      }
      this.cost = db.object(this.orderRef + '/cost').valueChanges();
      this.total = db.object(this.orderRef + '/total').valueChanges();
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
    }).catch(console.log);
    this.itemCats = db.list('/itemCat').valueChanges();
    this.itemCats.subscribe(console.log);
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
      }).catch(console.log);
  }

  onInputChange(event: Event) {

  }
}
