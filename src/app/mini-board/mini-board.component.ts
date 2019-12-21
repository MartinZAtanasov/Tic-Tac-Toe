import { GameStateService } from './../game-state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mini-board',
  templateUrl: './mini-board.component.html',
  styleUrls: ['./mini-board.component.css']
})
export class MiniBoardComponent implements OnInit, OnDestroy {

  constructor( private gameState: GameStateService) { }

  playerTurns: number[];
  computerTurns: number[];
  computerStarts: boolean;
  board: any[];
  miniBoard: any[];
  subscription: Subscription;

  ngOnInit() {
    this.miniBoard = this.gameState.resetBoardBoxes();
    this.subscription = this.gameState.gameStatus.subscribe( game => {
      this.playerTurns = game.playerTurns;
      this.computerTurns = game.computerTurns;
      this.computerStarts = game.computerStarts;
      this.board = game.boardBoxes;
      if (!game.gameOn) {
        this.playTurns();
      }
    });
  }

  playTurns() {
    let time = 1;
    const length = this.computerTurns.length > this.playerTurns.length ? this.computerTurns.length : this.playerTurns.length;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < length; i++) {
      if (!this.computerStarts) {
        setTimeout( () => {
          this.miniBoard[this.playerTurns[i] - 1].markType = 'x';
        }, time * 500);
        time++;
        if (this.miniBoard[this.computerTurns[i] - 1]) {
          setTimeout( () => {
            this.miniBoard[this.computerTurns[i] - 1].markType = 'o';
          }, time * 500);
          time++;
        }
      } else {
        setTimeout( () => {
          this.miniBoard[this.computerTurns[i] - 1].markType = 'x';
        }, time * 500);
        time++;
        if (this.miniBoard[this.playerTurns[i] - 1]) {
          setTimeout( () => {
            this.miniBoard[this.playerTurns[i] - 1].markType = 'o';
          }, time * 500);
          time++;
        }
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

