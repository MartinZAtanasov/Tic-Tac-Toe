import { ComputerFirstStrategiesService } from './../computer-first-strategies.service';
import { GameStateService } from './../game-state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-mid-round-card',
  templateUrl: './mid-round-card.component.html',
  styleUrls: ['./mid-round-card.component.css']
})
export class MidRoundCardComponent implements OnInit, OnDestroy {

  constructor(private gameState: GameStateService, private computerFirst: ComputerFirstStrategiesService) { }

  computerWon: boolean;
  computerStarts: boolean;
  game: any;
  subscription: Subscription;

  ngOnInit() {
    this.subscription = this.gameState.gameStatus.subscribe( game => {
      this.computerWon = game.computerWon;
      this.computerStarts = game.computerStarts;
      this.game = game;
    });
  }

  onStartGame() {
    const game = this.gameState.gameStatus.getValue();
    this.gameState.gameStatus.next({...game, gameOn: true});
  }

  onNextRound() {
    this.gameState.resetBoard(this.computerWon);
    if (this.computerStarts) {
      setTimeout( () => this.computerFirst.computerTurn(), 0);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
