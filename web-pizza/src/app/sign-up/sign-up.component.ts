import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { User } from '../login/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  doneLoading = false;
  private user = new User();
  private confirmPassword = '';

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.auth.auth.onAuthStateChanged(user => {
      if (user) {
        this.router.navigateByUrl('myaccount');
      } else {
        this.doneLoading = true;
      }
    });
  }

  signup() {
    if (this.user.email !== '' && this.user.password !== '') {
      this.doneLoading = false;
      this.auth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password).then(user => {
        return this.auth.auth.signInWithEmailAndPassword(this.user.email, this.user.password);
      }).catch(error => {
        this.doneLoading = true;
        console.log(JSON.stringify(error));
      }).then(user => {
        if (user) {
          this.router.navigateByUrl('home');
        } else {
          this.doneLoading = true;
          console.log('Error signing up');
        }
      }).catch(error => {
        this.doneLoading = true;
        console.log(JSON.stringify(error));
      });
    } else {
      alert('Email and password must be filled out');
    }
  }

}
