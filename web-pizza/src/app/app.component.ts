import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { log } from 'util';
import { Observable } from 'rxjs/Observable';

/** Setup Angular component structure */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  /** Observable list of user information */
  userInfo: Observable<UserInfo>;
  /** Sets if user is logged in */
  isLoggedIn = false;
  /** Sets if user is an admin */
  isAdmin = false;

  /** Initalize variables and check if user is authed and an admin */
  constructor(private auth: AngularFireAuth, private db: AngularFireDatabase) {
    this.auth.auth.onAuthStateChanged(user => {
      this.isLoggedIn = user && !user.isAnonymous;
      this.userInfo = this.db.object(`/users/${user.uid}`).valueChanges();
      this.userInfo.subscribe(object => this.isAdmin = object.admin);
    });
  }
}

/** User model */
class UserInfo {
  /** Current active order key */
  activeOrder: string;
  /** Is user an admin */
  admin: boolean;
}
