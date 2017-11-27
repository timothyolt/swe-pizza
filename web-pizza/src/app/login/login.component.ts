import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Error } from '../../models/error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  doneLoading = false;
  email: string;
  password: string;
  error = new Error();

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.auth.auth.onAuthStateChanged(user => {
      if (user && !user.isAnonymous) {
        this.router.navigateByUrl('home').catch(console.log);
      } else {
        this.doneLoading = true;
      }
    });
  }

  login() {
    if (this.email !== '' && this.password !== '' && this.email && this.password) {
      this.doneLoading = false;
      const migrateUser = this.auth.auth.currentUser && this.auth.auth.currentUser.isAnonymous ? this.auth.auth.currentUser.uid : null;
      this.auth.auth.signInWithEmailAndPassword(this.email, this.password)
        .catch(error => {
        this.doneLoading = true;
        this.error.show(JSON.stringify(error));
      }).then(user => {
        return user.getIdToken(true);
      }).catch(error => {
        this.doneLoading = true;
        this.error.show(JSON.stringify(error));
      }).then(token => {
        const url = `https://us-central1-swe-pizza.cloudfunctions.net/app/hello`;
        // 'https://' + this.auth.app.options['authDomain'] + '/hello';
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
        console.log(req);
        req.send();
      }).catch(error => {
        this.doneLoading = true;
        this.error.show(JSON.stringify(error));
      }).then(user => {
        if (user) {
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
