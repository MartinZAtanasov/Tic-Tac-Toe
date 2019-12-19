import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private fireAuth: AngularFireAuth) {}

  title = 'Tic Tac Toe';
  user: Observable<firebase.User>;

  ngOnInit() {
    this.user = this.fireAuth.user;
  }
}
