import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private fireAuth: AngularFireAuth) {}

  title = 'Tic Tac Toe';

  ngOnInit() {
    const user = this.fireAuth.user;
  }
}
