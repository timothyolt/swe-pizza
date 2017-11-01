import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ItemCategory } from '../item-category/item-category';
import { Pizza } from './pizza';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css']
})
export class PizzaComponent implements OnInit {
  @Input() pizza: Pizza;
  @Input() itemCats: FirebaseListObservable<ItemCategory[]>;

  constructor(private db: AngularFireDatabase) {
  }

  private _orderRef: string;

  get orderRef(): string {
    return this._orderRef;
  }

  @Input()
  set orderRef(value: string) {
    this._orderRef = value;
    const pizzaRef = this.db.database.ref(value + '/pizzas/' + this.pizza['$key']);
    pizzaRef.child('name').on('value', name => this.pizza.name = (name.exists() ? name.val() : null));
    pizzaRef.child('cost').on('value', cost => this.pizza.cost = (cost.exists() ? cost.val() : null));
  }

  ngOnInit() {
  }

  removePizza(e) {
    this.db.database.ref(this.orderRef).child('pizzas').transaction(pizzas => {
      pizzas.splice(Number(this.pizza['$key']), 1);
      return pizzas;
    });
  }

}
