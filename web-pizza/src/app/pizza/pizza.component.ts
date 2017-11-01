import { Component, Input, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { ItemCategory } from '../item-category/item-category';
import { Pizza } from './pizza';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css']
})
export class PizzaComponent implements OnInit {

  @Input() orderRef: string;
  @Input() pizza: Pizza;
  @Input() itemCats: FirebaseListObservable<ItemCategory[]>;

  ngOnInit() {
  }

}
