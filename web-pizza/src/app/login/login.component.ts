import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Error } from '../../models/error';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  /** RXJS Observable subscription */
  subscription = new Subscription();
  /** Sets whether or not to show the UI */
  doneLoading = false;
  /** Model for email address */
  email: string;
  /** Model for password */
  password: string;
  /** Error model */
  error = new Error();

  constructor(private auth: AngularFireAuth, private router: Router) { }

  /** 
   * Check if user is authenticated
   * 
   * Called when Angular is ready */
  ngOnInit() {
    this.subscription.add(this.auth.auth.onAuthStateChanged(user => {
      if (user && !user.isAnonymous) {
        this.router.navigateByUrl('home').catch(console.log);
      } else {
        this.doneLoading = true;
      }
    }));
  }

  /** Removes subscription when component is destroyed */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /** Authenticate the user and get their auth token */
  login() {
    if (this.email !== '' && this.password !== '' && this.email && this.password) {
      this.doneLoading = false;
      let anonymousUserToken: any;
      const anonymousUserPromise = this.auth.auth.currentUser && this.auth.auth.currentUser.isAnonymous
        ? this.auth.auth.currentUser.getIdToken(true).then(token => anonymousUserToken = token)
        : Promise.resolve(null);
      anonymousUserPromise.then(() => {
         return this.auth.auth.signInWithEmailAndPassword(this.email, this.password);
      }).then(user => {
        if (user) {
          return user ? user.getIdToken(true) : null;
        } else {
          this.doneLoading = true;
          this.error.show('Incorrect username and password.');
        }
      }).then(token => {
        if (!anonymousUserToken) {
          this.doneLoading = true;
          this.error.show('Tokenization error');
          return;
        }
        const url = `https://us-central1-swe-pizza.cloudfunctions.net/app/acquireUser`;
        const req = new XMLHttpRequest();
        req.onload = function() {
          console.log(req.responseText);
        }.bind(this);
        req.onerror = function() {
          this.error.show('There was an error');
        }.bind(this);
        req.open('GET', url, true);
        req.setRequestHeader('Authorization', 'Bearer ' + token);
        req.setRequestHeader('SecondAuthorization', 'Bearer ' + anonymousUserToken);
        req.send();
        if (token) {
          this.router.navigateByUrl('home').catch(console.log);
        } else {
          this.doneLoading = true;
          this.error.show('Incorrect username and password.');
        }
      }).catch(error => {
        this.doneLoading = true;
        this.error.show(JSON.stringify(error));
      });
    } else {
      this.doneLoading = true;
      this.error.show('Email and password must be filled out.');
    }
  }

}
