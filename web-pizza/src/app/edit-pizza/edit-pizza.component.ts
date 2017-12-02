import { Component, Input, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-edit-pizza',
  templateUrl: './edit-pizza.component.html',
  styleUrls: ['./edit-pizza.component.css']
})
export class EditPizzaComponent implements OnInit {
  pizzaRef: AngularFireObject<Pizza>;
  @Input() pizza = new Pizza();
  @Input() itemCatSnapshots: Observable<SnapshotAction[]>;

  nameEditable = false;
  pizzaName: string;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.itemCatSnapshots = this.db.list('/itemCat').snapshotChanges().shareReplay(1);
    this.itemCatSnapshots.subscribe(console.log);
  }

}
