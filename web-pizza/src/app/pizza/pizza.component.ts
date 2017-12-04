import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

/** Setup Angular component structure */
@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css']
})
export class PizzaComponent implements OnInit, OnDestroy {
  /** RXJS Observable subscription */
  subscription = new Subscription();
  /** Firebase reference for Pizza */
  pizzaRef: AngularFireObject<Pizza>;
  /** Pizza from HTML property */
  @Input() pizza: Pizza;
  /** ItemCatagory from HTML property */
  @Input() itemCatSnapshots: Observable<SnapshotAction[]>;
  /** Data-bound boolean for whether pizza name input is editable */
  nameEditable = false;
  /** Data-bound string holds name for pizza */
  pizzaName: string;

  /** Initalize AngularFireDatabase */
  constructor(private db: AngularFireDatabase) {
  }

  /** Firebase reference for current order */
  private _orderRef: string;

  /** Get order reference from HTML property */
  get orderRef(): string {
    return this._orderRef;
  }

  /** Reflect order reference to HTML property */
  @Input()
  set orderRef(value: string) {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    console.log('key');
    console.log(value);
    this._orderRef = value;
    this.pizzaRef = this.db.object(value + '/pizzas/' + this.pizza['$key']);
    this.subscription.add(this.db.object(value + '/pizzas/' + this.pizza['$key'] + '/name')
      .snapshotChanges().subscribe(name => this.pizza.name = (name.payload.exists() ? name.payload.val() : null)));
    this.subscription.add(this.db.object(value + '/pizzas/' + this.pizza['$key'] + '/cost')
      .snapshotChanges().subscribe(cost => this.pizza.cost = (cost.payload.exists() ? cost.payload.val() : null)));
  }

  /** Called when Angular is ready */
  ngOnInit() {
  }

  /** Recreat subscription when component is destroyed */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
  }

  /** Update pizza name on Firebase when changed */
  savePizzaName() {
    if (this.pizzaName) {
      console.log('update pizza pizzaName');
      console.log(this.pizzaName);
      this.pizzaRef.update({name: this.pizzaName}).catch(console.log);
      this.pizzaName = null;
    }
    this.nameEditable = false;
  }

  /** Remove pizza from current order on Firebase */
  removePizza() {
    this.db.database.ref(this.orderRef).child('pizzas').transaction(pizzas => {
      pizzas.splice(Number(this.pizza['$key']), 1);
      return pizzas;
    }).catch(console.log);
  }

}
