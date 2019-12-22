import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.css']
})
export class GameInfoComponent implements OnInit {

  constructor(private gameState: GameStateService, private fireAuth: AngularFireAuth) { }

  game: Observable<any>;
  token: Observable<firebase.auth.IdTokenResult>;

  ngOnInit() {
    this.game = this.gameState.gameStatus;
    this.token = this.fireAuth.idTokenResult;
  }

}
