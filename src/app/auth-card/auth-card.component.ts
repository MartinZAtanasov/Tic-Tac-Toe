import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-auth-card',
  templateUrl: './auth-card.component.html',
  styleUrls: ['./auth-card.component.css']
})
export class AuthCardComponent implements OnInit {

  constructor(private fireAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  socialLogin(type: string) {
    const provider = type === 'fb' ?
      new firebase.auth.FacebookAuthProvider() : new firebase.auth.GoogleAuthProvider();
    this.fireAuth.auth.signInWithPopup(provider);
  }

}
