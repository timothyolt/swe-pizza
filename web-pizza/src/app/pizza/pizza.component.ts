import { Component, Input, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css']
})
export class PizzaComponent implements OnInit {
  pizzaRef: AngularFireObject<Pizza>;
  @Input() pizza: Pizza;
  @Input() itemCatSnapshots: Observable<SnapshotAction[]>;

  nameEditable = false;
  pizzaName: string;

  constructor(private db: AngularFireDatabase) {
  }

  private _orderRef: string;

  get orderRef(): string {
    return this._orderRef;
  }

  @Input()
  set orderRef(value: string) {
    console.log('key');
    console.log(value);
    this._orderRef = value;
    this.pizzaRef = this.db.object(value + '/pizzas/' + this.pizza['$key']);
    this.db.object(value + '/pizzas/' + this.pizza['$key'] + '/name')
      .snapshotChanges().subscribe(name => this.pizza.name = (name.payload.exists() ? name.payload.val() : null));
    this.db.object(value + '/pizzas/' + this.pizza['$key'] + '/cost')
      .snapshotChanges().subscribe(cost => this.pizza.cost = (cost.payload.exists() ? cost.payload.val() : null));
  }

  ngOnInit() {
  }

  savePizzaName() {
    if (this.pizzaName) {
      console.log('update pizza pizzaName');
      console.log(this.pizzaName);
      this.pizzaRef.update({name: this.pizzaName}).catch(console.log);
      this.pizzaName = null;
    }
    this.nameEditable = false;
  }

  removePizza() {
    this.db.database.ref(this.orderRef).child('pizzas').transaction(pizzas => {
      pizzas.splice(Number(this.pizza['$key']), 1);
      return pizzas;
    }).catch(console.log);
  }

}
