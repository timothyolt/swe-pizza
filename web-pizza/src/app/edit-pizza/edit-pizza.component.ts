import { Component, Input, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take'

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
    this.itemCatSnapshots.subscribe(console.log);

    this.itemTypeSnapshots = this.db.list('/itemType').snapshotChanges().take(1);
    this.itemTypeSnapshots.subscribe(console.log);
  }

}
