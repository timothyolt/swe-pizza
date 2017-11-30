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
  subscription = new Subscription();
  doneLoading = false;
  email: string;
  password: string;
  error = new Error();

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.subscription.add(this.auth.auth.onAuthStateChanged(user => {
      if (user && !user.isAnonymous) {
        this.router.navigateByUrl('home').catch(console.log);
      } else {
        this.doneLoading = true;
      }
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login() {
    if (this.email !== '' && this.password !== '' && this.email && this.password) {
      this.doneLoading = false;
      let anonymousUserToken: any;
      const anonymousUserPromise = this.auth.auth.currentUser && this.auth.auth.currentUser.isAnonymous
        ? this.auth.auth.currentUser.getIdToken(true).catch(error => {
          this.doneLoading = true;
          this.error.show(JSON.stringify(error));
        }).then(token => anonymousUserToken = token)
        : Promise.resolve(null);
      anonymousUserPromise.then(() => {
         return this.auth.auth.signInWithEmailAndPassword(this.email, this.password);
      }).catch(error => {
        this.doneLoading = true;
        this.error.show(JSON.stringify(error));
      }).then(user => {
        if (user) {
          return user ? user.getIdToken(true) : null;
        } else {
          this.doneLoading = true;
          this.error.show('Incorrect username and password.');
        }
      }).catch(error => {
        this.doneLoading = true;
        this.error.show(JSON.stringify(error));
      }).then(token => {
        if (!anonymousUserToken) {
          this.doneLoading = true;
          this.error.show('Tokenization error');
          return;
        }
        const url = `https://us-central1-swe-pizza.cloudfunctions.net/app/acquireUser`;
        console.log('Sending request to', url, 'with ID token in Authorization header.');
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
        console.log(req);
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
