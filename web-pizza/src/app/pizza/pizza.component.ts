import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ItemCategory } from '../item-category/item-category';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css']
})
export class PizzaComponent implements OnInit {

  @Input() pizza: any;
  @Input() itemCats: FirebaseListObservable<ItemCategory[]>;

  ngOnInit() {
  }

}
