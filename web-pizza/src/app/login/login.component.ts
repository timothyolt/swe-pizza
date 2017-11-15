import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  doneLoading = false;
  private user = {
    email: '',
    password: ''
  }

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
    if (this.user.email !== '' && this.user.password !== '') {
      this.doneLoading = false;
      this.auth.auth.signInWithEmailAndPassword(this.user.email, this.user.password).then(user => {
        if (user) {
          this.router.navigateByUrl('home');
        } else {
          this.doneLoading = true;
          alert('Incorrect username and password');
        }
      }).catch(error => {
        this.doneLoading = true;
        alert(JSON.stringify(error));
      });
    } else {
      alert('Email and password must be filled out');
    }
  }

}
