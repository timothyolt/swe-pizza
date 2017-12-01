import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { ItemCategory } from '../../models/item-category';

@Component({
  selector: 'app-create-topping-cat',
  templateUrl: './create-topping-cat.component.html',
  styleUrls: ['./create-topping-cat.component.css']
})
export class CreateToppingCatComponent implements OnInit {
  catagory = new ItemCategory();

  constructor(private db: AngularFireDatabase, private router: Router) { }

  ngOnInit() {
  }

  save() {
    this.db.object('/itemCat').query.ref.push({
      name: this.catagory.name,
      exclusive: this.catagory.exclusive
    }).then(item => {
      this.router.navigateByUrl('/admin');
    });
  }

}
