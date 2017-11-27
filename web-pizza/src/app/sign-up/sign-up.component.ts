import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Error } from '../../models/error';
import * as firebase from 'firebase';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  doneLoading = false;
  email: string;
  password: string;
  confirmPassword = '';
  error = new Error();

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.auth.auth.onAuthStateChanged(user => {
      if (user && !user.isAnonymous) {
        this.router.navigateByUrl('account').catch(console.log);
      } else {
        this.doneLoading = true;
      }
    });
  }

  signUp() {
    if (this.email !== '' && this.password !== '' && this.email && this.password) {
      this.doneLoading = false;
      if (this.auth.auth.currentUser && this.auth.auth.currentUser.isAnonymous) {
        const emailCredential = EmailAuthProvider.credential(this.email, this.password);
        this.auth.auth.currentUser.linkWithCredential(emailCredential).catch(error => {
          this.doneLoading = true;
          this.error.show(JSON.stringify(error));
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
        this.auth.auth.createUserWithEmailAndPassword(this.email, this.password).then(user => {
          return this.auth.auth.signInWithEmailAndPassword(this.email, this.password);
        }).catch(error => {
          this.doneLoading = true;
          this.error.show(JSON.stringify(error));
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
