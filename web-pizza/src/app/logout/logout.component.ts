import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Error } from '../../models/error';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  /** Sets whether or not to show the UI */
  doneLoading = false;
  /** Error model */
  error = new Error();

  constructor(private auth: AngularFireAuth, private router: Router) { }

  /** 
   * Logs the user out
   * 
   * Called when Angular is ready 
  */
  ngOnInit() {
    console.log('logging out');
    this.doneLoading = false;
    this.auth.auth.signOut().then(() => {
      return this.router.navigateByUrl('home');
    }).then(() => {
      this.doneLoading = true;
    }).catch(error => {
      this.doneLoading = true;
      this.error.show(JSON.stringify(error));
    });
  }

}
