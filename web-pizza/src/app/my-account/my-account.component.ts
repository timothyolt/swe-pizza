import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  /** Sets whether or not to show the UI */
  doneLoading = false;

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, private router: Router) { }

  /** 
   * Show UI if user is logged in
   * 
   * Called when Angular is ready 
  */
  ngOnInit() {
    this.auth.auth.onAuthStateChanged(user => {
      if (user && !user.isAnonymous) {
        this.doneLoading = true;
      } else {
        this.router.navigateByUrl('login');
      }
    });
  }

}
