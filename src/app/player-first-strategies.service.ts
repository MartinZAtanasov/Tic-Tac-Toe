import { GameStateService } from './game-state.service';
import { Injectable } from '@angular/core';

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
          const isMiddle = this.gameState.middles.includes(playerMove2);
          const strategy = isMiddle ? 'mid-mid' : 'mid-corner';
          this.gameState.gameStatus.next( {...game, strategy});
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
      case 'mid-mid':
        this.midMidStrategy();
        break;
      case 'mid-corner':
        this.midCornerStrategy();
        break;
        default: break;
    }
  }

  midMidStrategy() {
    const game = this.gameState.gameStatus.getValue();
    const computerWinMove = this.gameState.getWinMove(true);
    const playerWinMove = this.gameState.getWinMove(false);
    const playerMove = game.playerTurns[0];
    const playerMove2 = game.playerTurns[1];
    if (game.turn === 4) {
      const surroundingCorner = this.gameState.surroundingCorners.filter( v => v.includes(playerMove) && v.includes(playerMove2));
      const ranodmCorner = this.gameState.randomEmptyBox(false, true);
      const move = surroundingCorner.length ? surroundingCorner[0][0] : ranodmCorner;
      this.gameState.markBox(move, 'o', true);
    }
    if (game.turn === 6) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        this.endRound(true);
      } else {
        const move = playerWinMove ? playerWinMove : this.gameState.randomEmptyBox(false, true);
        this.gameState.markBox(move, 'o', true);
      }
    }
    if (game.turn === 8) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        this.endRound(true);
      } else {
        this.gameState.markBox(this.gameState.randomEmptyBox(), 'o', true);
        this.endRound(false);
      }
    }
  }

  midCornerStrategy() {
    const game = this.gameState.gameStatus.getValue();
    const playerWinMove = this.gameState.getWinMove(false);
    const computerWinMove = this.gameState.getWinMove(true);
    const playerMove = game.playerTurns[0];
    const playerMove2 = game.playerTurns[1];
    if (game.turn === 4) {
      if (playerWinMove) {
        this.gameState.markBox(playerWinMove, 'o', true);
      } else {
        const corners = this.gameState.winingCombinations
          .filter( v => !v.includes(5) && v.includes(playerMove))[0]
          .filter( v => this.gameState.corners.includes(v));
        const winingCombinations = this.gameState.filterWinCombinations(game.computerTurns)
          .filter( v => v.includes(playerMove2));
        const option1 = winingCombinations.filter( v => v.includes(corners[0]));
        const move = option1.length ? corners[0] : corners[1];
        this.gameState.markBox(move, 'o', true);
      }
    }
    if (game.turn === 6) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        this.endRound(true);
      } else {
        this.gameState.markBox(playerWinMove, 'o', true);
      }
    }
    if (game.turn === 8) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        this.endRound(true);
      } else {
        const move = playerWinMove ? playerWinMove : this.gameState.randomEmptyBox();
        this.gameState.markBox(move, 'o', true);
        this.endRound(false);
      }
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
        this.endRound(true);
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
        this.endRound(true);
      } else {
        if (playerWinMove) {
          this.gameState.markBox(playerWinMove, 'o', true);
        } else {
          this.gameState.markBox(this.gameState.randomEmptyBox(), 'o', true);
        }
        this.endRound(false);
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
        this.endRound(true);
      } else {
        const move2 = playerWinMove ? playerWinMove : this.gameState.randomEmptyBox(true);
        this.gameState.markBox(move2, 'o', true);
      }
    }
    if (game.turn === 8) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        this.endRound(true);
      } else {
        this.gameState.markBox(playerWinMove, 'o', true);
        this.endRound(false);
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
        this.endRound(true);
      } else {
        this.gameState.markBox(playerWinMove, 'o', true);
      }
    }
    if (game.turn === 8) {
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'o', true);
        this.endRound(true);
      } else {
        const move = playerWinMove ? playerWinMove : this.gameState.randomEmptyBox();
        this.gameState.markBox(move, 'o', true);
        this.endRound(false);
      }
    }
  }

  endRound(computerScores: boolean) {
    if (!computerScores) {
      this.gameState.markBox(this.gameState.randomEmptyBox(), 'x', false);
    }
    this.gameState.endRound(computerScores);
  }
}
