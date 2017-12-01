import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ItemCategory } from '../../models/item-category';
import { ItemType } from '../../models/item-type';

@Component({
  selector: 'app-create-topping',
  templateUrl: './create-topping.component.html',
  styleUrls: ['./create-topping.component.css']
})
export class CreateToppingComponent implements OnInit {
  topping = new ItemType();
  itemCats: Observable<ItemCategory[]>;
  selectedToppingKey: string;

  constructor(private db: AngularFireDatabase, private router: Router) { }

  ngOnInit() {  
    this.itemCats = this.db.list('/itemCat').snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  save() {
    this.db.object('/itemType').query.ref.push({
      name: this.topping.name,
      cost: this.topping.cost,
      cat: this.topping.cat
    }).then(item => {
      this.router.navigateByUrl('/admin');
    });
  }

}
