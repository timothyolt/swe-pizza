import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Error } from '../../models/error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private doneLoading: boolean = false;
  private user: User = new User();
  private error = new Error();

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.auth.auth.onAuthStateChanged(user => {
      if (user) {
        this.router.navigateByUrl('home');
      } else {
        this.doneLoading = true;
      }
    });
  }

  login() {
    if (this.user.email !== '' && this.user.password !== '' && this.user.email && this.user.password) {
      this.doneLoading = false;
      this.auth.auth.signInWithEmailAndPassword(this.user.email, this.user.password).then(user => {
        if (user) {
          this.router.navigateByUrl('home');
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
