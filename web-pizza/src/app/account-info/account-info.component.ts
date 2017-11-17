import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Account } from './account';
import { Card } from './card';
import { User } from '../login/user';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  private account = new Account();
  private card = new Card();
  private user = new User();

  constructor(private auth: AngularFireAuth) { }

  ngOnInit() {

  }

}
