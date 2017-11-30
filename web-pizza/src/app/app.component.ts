import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { log } from 'util';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  userInfo: Observable<UserInfo>;
  isLoggedIn = false;
  isAdmin = false;

  constructor(private auth: AngularFireAuth, private db: AngularFireDatabase) {
    this.auth.auth.onAuthStateChanged(user => {
      this.isLoggedIn = user && !user.isAnonymous;
      this.userInfo = this.db.object(`/users/${user.uid}`).valueChanges();
      this.userInfo.subscribe(object => this.isAdmin = object.isAdmin);
    });
  }
}

class UserInfo {
  activeOrder: string;
  isAdmin: boolean;
}
