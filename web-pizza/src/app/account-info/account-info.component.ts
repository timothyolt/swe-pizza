import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Account } from '../../models/account';
import { Card } from '../../models/card';
import { User } from '../../models/user';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  account = new Account();
  card = new Card();
  user = new User();

  constructor(private auth: AngularFireAuth) { }

  ngOnInit() {

  }

}
