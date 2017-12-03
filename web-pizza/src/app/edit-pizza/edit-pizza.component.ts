import { Component, Input, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take'
declare var $;

@Component({
  selector: 'app-edit-pizza',
  templateUrl: './edit-pizza.component.html',
  styleUrls: ['./edit-pizza.component.css']
})
export class EditPizzaComponent implements OnInit {
  @Input() pizza = new Pizza();
  itemCatSnapshots: Observable<SnapshotAction[]>;
  itemTypeSnapshots: Observable<SnapshotAction[]>;

  nameEditable = false;
  pizzaName: string;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.itemCatSnapshots = this.db.list('/itemCat').snapshotChanges().take(1);
    this.itemTypeSnapshots = this.db.list('/itemType').snapshotChanges().take(1);

    this.itemCatSnapshots.subscribe(cat => {

    });
    this.itemTypeSnapshots.subscribe(type => {

    });

    $(document).ready(() => {
      this.db.object('/defaultPizza').query.ref.once('value', defaultPizza => {
        this.pizza.name = defaultPizza.val().name;
      }).then(objects => {
        objects.forEach((object) => {
          if (object.key !== 'name') {  
            const key = object.key;        
            if (object.val() instanceof Object) {
              // for subjson(non-exclusive)
              let subkey = Object.keys(object.val())[0];
              $(`#${subkey}`).attr('checked', true);
            } else {
              //for string(exclusive)
              $(`#${object.val()}`).attr('checked', true);
            }
          }
        });
      });
    })
  }

  ___save() {
    this.db.object('/defaultPizza').set({
      name: this.pizza.name,
    })
  }

}
