import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ItemCategory } from '../../models/item-category';

@Component({
  selector: 'app-create-topping',
  templateUrl: './create-topping.component.html',
  styleUrls: ['./create-topping.component.css']
})
export class CreateToppingComponent implements OnInit {
  topping = {
    name: '',
    cost: '',
    cat: '',
  }
  itemCats: Observable<ItemCategory[]>;

  constructor(private db: AngularFireDatabase, private router: Router) { }

  ngOnInit() {
    this.itemCats = this.db.list('/itemCat').snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  save() {
    let ref = this.db.object('/itemType').query.ref.push({
      name: this.name,
      cost: this.cost,
      cat: this.cat
    }).then(item => {
      this.router.navigateByUrl('/admin');
    });
  }

}
