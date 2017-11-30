import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  doneLoading = false;

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.auth.auth.onAuthStateChanged(user => {
      if (user && !user.isAnonymous) {
        this.doneLoading = true;
      } else {
        this.router.navigateByUrl('login');
      }
    });
  }

}
