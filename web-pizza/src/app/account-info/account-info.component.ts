import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Card } from '../../models/card';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';

type NestedPartial<T> = {
  [P in keyof T]?: NestedPartial<T[P]>;
};

/** Setup Angular component structure */
@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  /** User email */
  email: string;
  /** Firebase User Reference */
  userRef: AngularFireObject<User>;
  /** Holds User objects from Firebase */
  user: Observable<User>;
  /** NestedPartial for User information */
  userPartial: any = {};
  /** Firebase Card Reference */
  paymentRef: AngularFireObject<Card>;
  /** Holds Card objects from Firebase */
  payment: Observable<Card>;
  /** NestedPartial for Payment information */
  paymentPartial: any = {};

  /** Initalize AngularFireDatabase and AngularFireAuth */
  constructor(private db: AngularFireDatabase, public auth: AngularFireAuth) { }

  /**
   * Called when Angular is ready
   */
  ngOnInit() {
    /** Waits for auth state to update then fetches user payment info */
    this.auth.auth.onAuthStateChanged(user => {
      if (user) {
        // todo get user info
        this.userRef = this.db.object('users/' + user.uid);
        this.user = this.userRef.valueChanges();
        this.userRef.query.ref.child('payMethods').once('value', payMethodsSnapshot => {
          if (payMethodsSnapshot.exists()) {
            const payMethods = payMethodsSnapshot.val();
            for (const key in payMethods) if (payMethods.hasOwnProperty(key)) {
              this.paymentRef = this.db.object('payMethods/' + key);
              this.payment = this.paymentRef.valueChanges();
              break;
              // todo support multiple payment methods
            }
          }
        }).catch(console.log);
      } else {
        // create anonymous user if not already signed in
        this.auth.auth.signInAnonymously().catch(console.log);
      }
    });
    // create anonymous user if not already signed in
    // if (!this.auth.auth.currentUser) {
    //   this.auth.auth.signInAnonymously().catch(console.log);
    // }
  }

  /** Saves user's email and address infomation to Firebase */
  saveAccountInfo() {
    console.log('saveAccountInfo');
    console.log(this.email);
    console.log(this.userPartial);
    if (this.email) {
      // todo re-authenticate before calling updateEmail
      this.auth.auth.currentUser.updateEmail(this.email).catch(console.log).then(() => {console.log('updated email'); });
    }
    this.userRef.query.ref.update(this.userPartial).catch(console.log);
    this.userPartial = {};
  }

  /** Saves user's credit card information to Firebase */
  savePaymentInfo() {
    console.log('savePaymentInfo');
    console.log(this.paymentPartial);
    if (!this.paymentRef) {
      const paymentPartial = {user: this.auth.auth.currentUser.uid};
      const paymentRef = this.db.database.ref('payMethods').push(paymentPartial).ref;
      const userPartial = {payMethods: {}};
      userPartial.payMethods[paymentRef.key] = true;
      this.userRef.update(userPartial).catch(console.log);
      this.paymentRef = this.db.object('payMethods/' + paymentRef.key);
      this.payment = this.paymentRef.valueChanges();
    }
    this.paymentRef.query.ref.update(this.paymentPartial).catch(console.log);
    this.paymentPartial = {};
  }

}
