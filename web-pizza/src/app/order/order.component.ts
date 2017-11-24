import { Component, OnInit} from '@angular/core';
import { Order } from '../../models/order';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

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
  itemCats: Observable<SnapshotAction[]>;

  constructor(private auth: AngularFireAuth, private db: AngularFireDatabase) {
    if (this.auth.auth.currentUser) {
      console.log('using user for order: ' + this.auth.auth.currentUser.uid);
      this.setupOrder(this.auth.auth.currentUser.uid);
    } else {
      console.log('creating anonymous user for order');
      this.auth.auth.signInAnonymously().catch(console.log).then(() => {
        console.log('using anonymous user for order: ' + this.auth.auth.currentUser.uid);
        this.setupOrder(this.auth.auth.currentUser.uid);
      });
    }
  }

  private setupOrder(userId: string) {
    this.db.database.ref('/users/' + userId).once('value', user => {
      if (user.exists() && user.val().activeOrder) {
        this.orderRef = '/orders/' + user.val().activeOrder;
      } else {
        const order = new Order();
        order.createdAtDate = new Date();
        order.user = userId;
        const orderId: string = this.db.database.ref('/orders').push(order).key;
        this.db.database.ref('/users/' + userId).update({activeOrder: orderId});
        this.orderRef = '/orders/' + orderId;
        this.addNewPizza(null);
      }
      this.cost = this.db.object(this.orderRef + '/cost').valueChanges();
      this.total = this.db.object(this.orderRef + '/total').valueChanges();
      this.db.database.ref(this.orderRef + '/pizzas').on('child_added', pizza => {
        if (!this.pizzas) {
          this.pizzas = [];
        }
        const pizzaVal = pizza.val();
        pizzaVal['$key'] = pizza.key;
        this.pizzas.splice(Number(pizza.key), 0, pizzaVal);
      });
      this.db.database.ref(this.orderRef + '/pizzas').on('child_removed', pizza => {
        this.pizzas.splice(Number(pizza.key), 1);
      });
    }).catch(console.log);
    this.itemCats = this.db.list('/itemCat').snapshotChanges();
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
        }).catch(console.log);
      }).catch(console.log);
  }
}
