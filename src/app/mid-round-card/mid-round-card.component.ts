import { ComputerFirstStrategiesService } from './../computer-first-strategies.service';
import { GameStateService } from './../game-state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-mid-round-card',
  templateUrl: './mid-round-card.component.html',
  styleUrls: ['./mid-round-card.component.css'],
})
export class MidRoundCardComponent implements OnInit, OnDestroy {

  constructor(
    private gameState: GameStateService,
    private computerFirst: ComputerFirstStrategiesService,
    private fireBase: FirebaseService
  ) { }

  computerWon: boolean;
  computerStarts: boolean;
  game: any;
  subscription: Subscription;

  savingResult = false;
  deletingResult = false;

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

  saveResult() {
    this.savingResult = true;
    this.fireBase.saveResult().subscribe( res => {
      res
      .then( () => this.savingResult = false)
      .catch( (err) => {
        this.savingResult = false;
        alert('Something went wrong: ' + err);
      });
    });
  }

  deleteResult() {
    this.deletingResult = true;
    this.fireBase.deleteResult().subscribe( promises => {
      if (promises) {
        promises
        .then( () => this.deletingResult = false)
        .catch( (err) => {
          this.deletingResult = false;
          alert('Something went wrong: ' + err);
        })
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
