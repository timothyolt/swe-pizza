import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemCategory } from '../../models/item-category';

@Component({
  selector: 'app-edit-topping-cat',
  templateUrl: './edit-topping-cat.component.html',
  styleUrls: ['./edit-topping-cat.component.css']
})
export class EditToppingCatComponent implements OnInit {
  doneLoading = false;
  catagory = new ItemCategory();
  key: string;

  constructor(private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.key = params['id'];
      this.db.object(`/itemCat/${this.key}`).query.ref.once('value', item => {
        this.catagory = item.val();
        this.doneLoading = true;
      });
    });
  }

  save() {
    this.db.object(`/itemCat/${this.key}`).query.ref.set({
      name: this.catagory.name,
      exclusive: this.catagory.exclusive ? this.catagory.exclusive : false
    }).then(item => {
      this.router.navigateByUrl('/admin');
    });
  }

  delete() {
    if (confirm('Are you sure you want to delete this topping catagory?(TEMP BOX)')) {
      this.db.object(`/itemCat/${this.key}`).query.ref.remove().then(() => {
        this.router.navigateByUrl('/admin');
      });
    }
  }

}
