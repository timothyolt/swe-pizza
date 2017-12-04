import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { ItemCategory } from '../../models/item-category';

/** Setup Angular component structure */
@Component({
  selector: 'app-create-topping-cat',
  templateUrl: './create-topping-cat.component.html',
  styleUrls: ['./create-topping-cat.component.css']
})
export class CreateToppingCatComponent implements OnInit {
  /** Data-bound ItemCategory model for form */
  catagory = new ItemCategory();

  /** Initalize variables */
  constructor(private db: AngularFireDatabase, private router: Router) { }

  /** Called when Angular is ready */
  ngOnInit() {
  }

  /** Pushes catagory model to Firebase */
  save() {
    this.db.object('/itemCat').query.ref.push({
      name: this.catagory.name,
      exclusive: this.catagory.exclusive ? this.catagory.exclusive : false
    }).then(item => {
      this.router.navigateByUrl('/admin');
    });
  }

}
