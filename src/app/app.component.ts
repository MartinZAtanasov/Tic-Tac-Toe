import { GameStateService } from './game-state.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private fireAuth: AngularFireAuth, private gameState: GameStateService) {}

  title = 'Tic Tac Toe';
  user: Observable<firebase.User>;
  game: Observable<any>;

  ngOnInit() {
    this.user = this.fireAuth.user;
    this.game = this.gameState.gameStatus;
  }
}
