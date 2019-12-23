import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-auth-card',
  templateUrl: './auth-card.component.html',
  styleUrls: ['./auth-card.component.css']
})
export class AuthCardComponent implements OnInit {

  constructor(private fireAuth: AngularFireAuth) { }

  @Output() showRanking: EventEmitter<void> = new EventEmitter();

  ngOnInit() {
  }

  socialLogin(type: string) {
    const provider = type === 'fb' ?
      new firebase.auth.FacebookAuthProvider() : new firebase.auth.GoogleAuthProvider();
    this.fireAuth.auth.signInWithPopup(provider);
  }

  guestLogin() {
    this.fireAuth.auth.signInAnonymously();
  }

  onShowRanking() {
    this.showRanking.emit();
  }

}
