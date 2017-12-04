import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ItemCategory } from '../../models/item-category';
import { ItemType } from '../../models/item-type';

/** Setup Angular component structure */
@Component({
  selector: 'app-create-topping',
  templateUrl: './create-topping.component.html',
  styleUrls: ['./create-topping.component.css']
})
export class CreateToppingComponent implements OnInit {
  /** Data-bound ItemType model for form */
  topping = new ItemType();
  /** Observable list of type ItemCatagory */
  itemCats: Observable<ItemCategory[]>;

  /** Initalize variables */
  constructor(private db: AngularFireDatabase, private router: Router) { }

  /** 
   * Fetches Observable list of ItemCatagory
   * 
   * Called when Angular is ready
   */
  ngOnInit() {  
    this.itemCats = this.db.list('/itemCat').snapshotChanges().map(changes => {
      // Creates map to extract and combine item key(id) and data value
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  /** Saves topping model to Firebase */
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
