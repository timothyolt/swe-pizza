import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../models/order';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

  orderRef: AngularFireObject<Order>;
  order: Observable<Order>;
  itemCats: Observable<SnapshotAction[]>;
  itemTypes: Observable<SnapshotAction[]>;

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderRef = this.db.object('orders/' + id);
    this.order = this.orderRef.valueChanges().shareReplay(1);
    this.itemCats = this.db.list('itemCat').snapshotChanges().shareReplay(1);
    this.itemTypes = this.db.list('itemType').snapshotChanges().shareReplay(1);
  }

}
