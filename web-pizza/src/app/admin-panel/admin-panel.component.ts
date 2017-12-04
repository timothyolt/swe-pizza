import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  /** Sets whether or not to show the UI */
  doneLoading = false;

  constructor(private auth: AngularFireAuth, private router: Router, private db: AngularFireDatabase) { }

  /** 
   * Waits for auth state to update then checks if user is an admin
   * 
   * Called when Angular is ready
   */
  ngOnInit() {
    this.auth.auth.onAuthStateChanged(user => {
      if (user && !user.isAnonymous) {
        this.db.object(`/users/${user.uid}`).query.ref.once('value', data => {
          if (data.val().admin) {
            this.doneLoading = true;
          } else {
            this.router.navigateByUrl('login');
          }
        });
      } else {
        this.router.navigateByUrl('login');
      }
    });
  }

}
