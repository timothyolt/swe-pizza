import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  isLoggedIn = false;

  constructor(private auth: AngularFireAuth) {
    this.auth.auth.onAuthStateChanged(user => {
      this.isLoggedIn = user && !user.isAnonymous;
    });
  }
}
