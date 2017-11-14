import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  private user = {
    email: '',
    password: '',
    confirmPassword: ''
  }

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.auth.auth.onAuthStateChanged(user => {
      if (user) {
        this.router.navigateByUrl('myaccount');
      }
    });
  }

  signup() {
    this.auth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password).then(user => {
      return this.auth.auth.signInWithEmailAndPassword(this.user.email, this.user.password);
    }).catch(error => {
      console.log(JSON.stringify(error));
    }).then(user => {
      if (user) {
        this.router.navigateByUrl('myaccount');
      } else {
        console.log('Error signing up');
      }
    }).catch(error => {
      console.log(JSON.stringify(error));
    });
  }

}
