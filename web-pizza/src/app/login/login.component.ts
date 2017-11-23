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
      this.auth.auth.signInWithEmailAndPassword(this.email, this.password).then(user => {
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
