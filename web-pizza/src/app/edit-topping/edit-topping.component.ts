import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ItemCategory } from '../../models/item-category';
import { ItemType } from '../../models/item-type';

/** Setup Angular component structure */
@Component({
  selector: 'app-edit-topping',
  templateUrl: './edit-topping.component.html',
  styleUrls: ['./edit-topping.component.css']
})
export class EditToppingComponent implements OnInit {
  /** Sets whether or not to show the UI */
  doneLoading = false;
  /** Data-bound model for ItemType */
  topping = new ItemType();
  /** Observable list of ItemCategory */
  itemCats: Observable<ItemCategory[]>;
  /** Topping id from Firebase */
  key: string;

  /** Initalize variables */
  constructor(private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute) { }

  /**
   * Fetch ItemCatagory and ItemType from Firebase
   * 
   * Called when Angular is ready
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.key = params['id'];

      this.db.object(`/itemType`).query.ref.child(this.key).once('value', item => {
        this.topping = item.val();
        this.doneLoading = true;
      });

      this.itemCats = this.db.list('/itemCat').snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
    });
  }

  /** Save topping model to Firebase */
  save() {
    this.db.object(`/itemType/${this.key}`).query.ref.set({
      name: this.topping.name,
      cost: this.topping.cost,
      cat: this.topping.cat
    }).then(item => {
      this.router.navigateByUrl('/admin');
    });
  }

  /** Delete ItemType using key */
  delete() {
    if (confirm('Are you sure you want to delete this topping?(TEMP BOX)')) {
      this.db.object(`/itemType/${this.key}`).query.ref.remove().then(() => {
        this.router.navigateByUrl('/admin');
      });
    }
  }

}
