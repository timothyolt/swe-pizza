import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ItemCategory } from '../../models/item-category';
import { ItemType } from '../../models/item-type';

@Component({
  selector: 'app-edit-topping',
  templateUrl: './edit-topping.component.html',
  styleUrls: ['./edit-topping.component.css']
})
export class EditToppingComponent implements OnInit {
  doneLoading = false;
  topping = new ItemType();
  itemCats: Observable<ItemCategory[]>;
  key: string;

  constructor(private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute) { }

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

  save() {
    this.db.object(`/itemType/${this.key}`).query.ref.set({
      name: this.topping.name,
      cost: this.topping.cost,
      cat: this.topping.cat
    }).then(item => {
      this.router.navigateByUrl('/admin');
    });
  }

  delete() {
    if (confirm('Are you sure you want to delete this topping?(TEMP BOX)')) {
      this.db.object(`/itemType/${this.key}`).query.ref.remove().then(() => {
        this.router.navigateByUrl('/admin');
      });
    }
  }

}
