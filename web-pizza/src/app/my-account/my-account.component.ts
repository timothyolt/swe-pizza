import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { PastOrdersComponent } from '../past-orders/past-orders.component';
import { AccountInfoComponent } from '../account-info/account-info.component';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.auth.auth.onAuthStateChanged(user => {
      if (user) {
        //todo get user info
      } else {
        // this.router.navigateByUrl('login');
      }
    });
  }

}
