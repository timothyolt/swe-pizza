import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemCategory } from '../../models/item-category';

/** Setup Angular component structure */
@Component({
  selector: 'app-edit-topping-cat',
  templateUrl: './edit-topping-cat.component.html',
  styleUrls: ['./edit-topping-cat.component.css']
})
export class EditToppingCatComponent implements OnInit {
  /** Sets whether or not to show the UI */
  doneLoading = false;
  /** Data-bound model for ItemCategory */
  catagory = new ItemCategory();
  /** Id of ItemCategory */
  key: string;

  /** Initalize variables */
  constructor(private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute) { }

  /**
   * Fetch ItemCatagory from Firebase
   * 
   * Called when Angular is ready
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.key = params['id'];
      this.db.object(`/itemCat/${this.key}`).query.ref.once('value', item => {
        this.catagory = item.val();
        this.doneLoading = true;
      });
    });
  }

  /** Set itemCat using catagory model */
  save() {
    this.db.object(`/itemCat/${this.key}`).query.ref.set({
      name: this.catagory.name,
      exclusive: this.catagory.exclusive ? this.catagory.exclusive : false
    }).then(item => {
      this.router.navigateByUrl('/admin');
    });
  }

  /** Delete itemCat using key */
  delete() {
    if (confirm('Are you sure you want to delete this topping catagory?(TEMP BOX)')) {
      this.db.object(`/itemCat/${this.key}`).query.ref.remove().then(() => {
        this.router.navigateByUrl('/admin');
      });
    }
  }

}
