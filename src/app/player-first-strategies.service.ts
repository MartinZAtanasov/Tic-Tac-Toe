import { GameStateService } from './game-state.service';
import { ComputerFirstStrategiesService } from './computer-first-strategies.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerFirstStrategiesService {

  constructor(private gameState: GameStateService) { }

  computerTurn() {
    const game = this.gameState.gameStatus.getValue();
    const playerMove = game.playerTurns[0];
    const playerMove2 = game.playerTurns[1];
    if (game.turn === 2) {
      if (!game.boardBoxes[4].markType) {
        this.gameState.markBox(5, 'o', true);
      } else {
        const randomCorner = this.gameState.corners[Math.floor(Math.random() * this.gameState.corners.length)];
        this.gameState.markBox(randomCorner, 'o', true);
      }
    }
    if (game.turn === 4) {
      if (playerMove === 5) {
        this.gameState.gameStatus.next( {...game, strategy: 'center'});
      } else {
        if (this.gameState.middles.includes(playerMove)) {
          // Get the correct strategy (mid-corner / mid-mid)
          console.log('middle strategy');
        } else {
          const isCorner = this.gameState.corners.includes(playerMove2);
          const strategy = isCorner ? 'corner-corner' : 'corner-mid';
          this.gameState.gameStatus.next( {...game, strategy});
        }
      }
      this.playStrategy();
    }
    if (game.turn > 4) {
      this.playStrategy();
    }
  }

  playStrategy() {
    const game = this.gameState.gameStatus.getValue();
    switch (game.strategy) {
      case 'corner-corner':
        this.cornerCornerStrategy();
        break;
      case 'corner-mid':
        this.cornerMidStrategy();
        break;
      case 'center':
        this.centerStrategy();
        break;
        default: break;
    }
  }

  centerStrategy() {
    const game = this.gameState.gameStatus.getValue();
    const computerMove = game.computerTurns[0];
    const playerWinMove = this.gameState.getWinMove(false);
    const computerWinMove = this.gameState.getWinMove(true);
    if (game.turn === 4) {
      if (playerWinMove) {
        this.gameState.markBox(playerWinMove, 'o', true);
      } else {
        const randomCorner = this.gameState.randomEmptyBox(false, true);
        this.gameState.markBox(randomCorner, 'o', true);
      }
    }
    if (game.turn === 6) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        console.log('COMPUTER WINS');
      } else {
        if (playerWinMove) {
          this.gameState.markBox(playerWinMove, 'o', true);
        } else {
          const winComb = this.gameState.filterWinCombinations(game.playerTurns)[0];
          const corner = winComb.filter( v => this.gameState.corners.includes(v) && v !== computerMove)[0];
          const move = playerWinMove ? playerWinMove : corner;
          this.gameState.markBox(move, 'o', true);
        }
      }
    }
    if (game.turn === 8) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        console.log('COMPUTER WINS')
      } else {
        if (playerWinMove) {
          this.gameState.markBox(playerWinMove, 'o', true);
        } else {
          this.gameState.markBox(this.gameState.randomEmptyBox(), 'o', true);
        }
        console.log('DRAW');
      }
    }
  }

  cornerCornerStrategy() {
    const game = this.gameState.gameStatus.getValue();
    const playerWinMove = this.gameState.getWinMove(false);
    const computerWinMove = this.gameState.getWinMove(true);
    let move: number;
    if (game.turn === 4) {
      move = playerWinMove ? playerWinMove : this.gameState.randomEmptyBox(true);
      this.gameState.markBox(move, 'o', true);
    }
    if (game.turn === 6) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        console.log('COMPUTER WINS');
      } else {
        const move2 = playerWinMove ? playerWinMove : this.gameState.randomEmptyBox(true);
        this.gameState.markBox(move2, 'o', true);
      }
    }
    if (game.turn === 8) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        console.log('COMPUTER WINS');
      } else {
        this.gameState.markBox(playerWinMove, 'o', true);
        console.log('DRAW');
      }
    }
  }

  cornerMidStrategy() {
    const game = this.gameState.gameStatus.getValue();
    const playerWinMove = this.gameState.getWinMove(false);
    const computerWinMove = this.gameState.getWinMove(true);
    const playerMove = game.playerTurns[0];
    const playerMove2 = game.playerTurns[1];
    if (game.turn === 4) {
      if (playerWinMove) {
        this.gameState.markBox(playerWinMove, 'o', true);
      } else {
        const crossWinCombinations = this.gameState.winingCombinations.filter( (_, i, arr) => i > arr.length - 3);
        const crossWinComb = crossWinCombinations.filter( v => v.includes(playerMove) && v.includes(5))[0];
        const corner = crossWinComb.filter( v => v !== 5 && v !== playerMove)[0];
        const winComb = this.gameState.winingCombinations.filter( v => v.includes(corner) && v.includes(playerMove2));
        const move = winComb[0].filter( v => v !== corner && v !== playerMove2)[0];
        this.gameState.markBox(move, 'o', true);
      }
    }
    if (game.turn === 6) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        console.log('COMPUTER WINS');
      } else {
        this.gameState.markBox(playerWinMove, 'o', true);
      }
    }
    if (game.turn === 8) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        console.log('COMPUTER WINS');
      } else {
        const move = playerWinMove ? playerWinMove : this.gameState.randomEmptyBox();
        this.gameState.markBox(move, 'o', true);
        console.log('DRAW');
      }
    }
  }
}
