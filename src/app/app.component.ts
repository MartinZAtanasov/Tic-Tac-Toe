import { modalPop } from './animations';
import { GameStateService } from './game-state.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [modalPop]
})
export class AppComponent implements OnInit {

  constructor(private fireAuth: AngularFireAuth, private gameState: GameStateService) {}

  title = 'Tic Tac Toe';
  user: Observable<firebase.User>;
  game: Observable<any>;

  showRanking = false;
  closableRanking = true;

  ngOnInit() {
    this.user = this.fireAuth.user;
    this.game = this.gameState.gameStatus;
  }

  finishGame() {
    this.showRanking = true;
    this.closableRanking = false;
  }
}
