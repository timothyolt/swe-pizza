import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Error } from '../../models/error';
import { User } from '../../models/user';
import * as firebase from 'firebase';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import { Subscription } from 'rxjs/Subscription';

/** Setup Angular component structure */
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  /** RXJS Observable subscription */
  subscription = new Subscription();
  /** Sets whether or not to show the UI */
  doneLoading = false;
  /** Email model */
  email: string;
  /** Password model */
  password: string;
  /** Confirm password model */
  confirmPassword = '';
  /** Error model */
  error = new Error();

  /** Initalize variables */
  constructor(private auth: AngularFireAuth, private router: Router) { }

  /** 
   * Check if user is logged in and redirect if they are
   * 
   * Called when Angular is ready 
  */
  ngOnInit() {
    this.subscription.add(this.auth.auth.onAuthStateChanged(user => {
      if (user && !user.isAnonymous) {
        this.router.navigateByUrl('home').catch(console.log);
      } else {
        this.doneLoading = true;
      }
    }));
  }

  /** Unsubscribe when component is destroyed */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /** Sign up and log in user */
  signUp() {
    if (this.email !== '' && this.password !== '') {
      this.doneLoading = false;
      if (this.auth.auth.currentUser && this.auth.auth.currentUser.isAnonymous) {
        const emailCredential = EmailAuthProvider.credential(this.email, this.password);
        this.auth.auth.currentUser.linkWithCredential(emailCredential).then(() => {
          // counter-intuitive, but this is what we need to trigger a state change on credential link
          return this.auth.auth.signOut();
        }).then(() => {
          return this.auth.auth.signInWithEmailAndPassword(this.email, this.password);
        }).then(user => {
          if (user) {
            this.router.navigateByUrl('home').catch(console.log);
          } else {
            this.doneLoading = true;
            this.error.show('Error signing up.');
          }
        }).catch(error => {
          this.doneLoading = true;
          this.error.show(JSON.stringify(error));
        });
      } else {
        this.auth.auth.createUserWithEmailAndPassword(this.email, this.password).then(() => {
          return this.auth.auth.signInWithEmailAndPassword(this.email, this.password);
        }).then(user => {
          if (user) {
            this.router.navigateByUrl('home').catch(console.log);
          } else {
            this.doneLoading = true;
            this.error.show('Error signing up.');
          }
        }).catch(error => {
          this.doneLoading = true;
          this.error.show(JSON.stringify(error));
        });
      }
    } else {
      this.doneLoading = true;
      this.error.show('Email and password must be filled out.');
    }
  }

}
