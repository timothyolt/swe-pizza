import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Error } from '../../models/error';

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
      const migrateUser = this.auth.auth.currentUser && this.auth.auth.currentUser.isAnonymous ? this.auth.auth.currentUser.uid : null;
      this.auth.auth.createUserWithEmailAndPassword(this.email, this.password).then(user => {
        return this.auth.auth.signInWithEmailAndPassword(this.email, this.password);
      }).catch(error => {
        this.doneLoading = true;
        this.error.show(JSON.stringify(error));
      }).then(user => {
        return user.getToken(true);
      }).catch(error => {
          this.doneLoading = true;
          this.error.show(JSON.stringify(error));
      }).then(token => {
        const url = 'https://' + this.auth.app.options['authDomain'] + '/hello';
        console.log('Sending request to', url, 'with ID token in Authorization' +
          ' header.');
        const req = new XMLHttpRequest();
        req.onload = function() {
          console.log(req.responseText);
        }.bind(this);
        req.onerror = function() {
          this.error.show('There was an error');
        }.bind(this);
        req.open('GET', url, true);
        req.setRequestHeader('Authorization', 'Bearer ' + token);
        req.send();
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
      this.doneLoading = true;
      this.error.show('Email and password must be filled out.');
    }
  }

}
