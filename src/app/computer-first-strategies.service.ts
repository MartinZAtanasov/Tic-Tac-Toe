import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root'
})
export class ComputerFirstStrategiesService {

  constructor(private gameState: GameStateService) { }

  computerTurn() {
    const game = this.gameState.gameStatus.getValue();
    const playerTurn = game.playerTurns[0];
    const computerTurn = game.computerTurns[0];
    if (game.turn === 1) {
      const randomIndex = Math.floor(Math.random() * 3) + 1;
      if (randomIndex === 1) {
        this.gameState.markBox(5, 'x', true);
      }
      if (randomIndex === 2) {
        const randomMiddle = this.gameState.middles[Math.floor(Math.random() * this.gameState.middles.length)];
        this.gameState.markBox(randomMiddle, 'x', true);
      }
      if (randomIndex === 3) {
        const randomCorner = this.gameState.corners[Math.floor(Math.random() * this.gameState.corners.length)];
        this.gameState.markBox(randomCorner, 'x', true);
      }
    }
    if (game.turn === 3) {
      // Center strategy
      if (computerTurn === 5) {
        if (this.gameState.middles.includes(playerTurn)) {
          this.gameState.gameStatus.next( {...game, strategy: 'center-mid'});
        }
        if (this.gameState.corners.includes(playerTurn)) {
          this.gameState.gameStatus.next( {...game, strategy: 'center-corner'});
        }
      }
      // Corner strategy
      if (this.gameState.corners.includes(computerTurn)) {
        if (this.gameState.corners.includes(playerTurn)) {
          this.gameState.gameStatus.next( {...game, strategy: 'corner-corner'});
        }
        if (this.gameState.middles.includes(playerTurn)) {
          this.gameState.gameStatus.next( {...game, strategy: 'corner-mid'});
        }
        if (playerTurn === 5) {
          this.gameState.gameStatus.next( {...game, strategy: 'corner-center'});
        }
      }
      // Middle strategy
      if (this.gameState.middles.includes(computerTurn)) {
        if (this.gameState.middles.includes(playerTurn)) {
          this.gameState.gameStatus.next( {...game, strategy: 'mid-mid'});
        }
        if (this.gameState.corners.includes(playerTurn)) {
          this.gameState.gameStatus.next( {...game, strategy: 'mid-corner'});
        }
        if (playerTurn === 5) {
          this.gameState.gameStatus.next( {...game, strategy: 'mid-center'});
        }
      }
      this.playStrategy();
    }
    if (game.turn === 5 ) {
      // Center strategy
      if (computerTurn === 5) {
        const isMiddle = this.gameState.middles.includes(game.playerTurns[1]);
        if (isMiddle && game.strategy === 'center-corner') {
          this.gameState.gameStatus.next( {...game, strategy: 'center-corner-middle'});
        }
        if (!isMiddle && game.strategy === 'center-corner') {
          this.gameState.gameStatus.next( {...game, strategy: 'center-corner-corner'});
        }
      }
      this.playStrategy();
    }
    if (game.turn > 5) {
      this.playStrategy();
    }
  }

  playStrategy() {
    const game = this.gameState.gameStatus.getValue();
    switch (game.strategy) {
      case 'center-mid':
        this.centerMidTurn();
        break;
      case 'center-corner':
        this.centerCornerTurn();
        break;
      case 'center-corner-middle':
        this.centerCornerMidTurn();
        break;
      case 'center-corner-corner':
        this.centerCornerCornerTurn();
        break;
      case 'corner-corner':
        this.cornerCornerStrategy();
        break;
      case 'corner-mid':
        this.cornerMidStrategy();
        break;
      case 'corner-center':
        this.cornerCenterStrategy();
        break;
      case 'mid-mid':
        this.midMidStrategy();
        break;
      case 'mid-corner':
        this.midCornerStrategy();
        break;
      case 'mid-center':
        this.midCenterStrategy();
        break;
      default: break;
    }
  }

  midCenterStrategy() {
    const game = this.gameState.gameStatus.getValue();
    const computerMove = game.computerTurns[0];
    const computerMove2 = game.computerTurns[1];
    const computerMove3 = game.computerTurns[2];
    const playerMove = game.playerTurns[1];
    if (game.turn === 3) {
      const surroundingCorners = this.gameState.surroundingCorners.filter( v => !v.includes(computerMove));
      const randomIndex = Math.round(Math.random());
      const corner = surroundingCorners[randomIndex][0];
      this.gameState.markBox(corner, 'x', true);
    }
    if (game.turn === 5) {
      const playerWinMove = this.gameState.getWinMove(false);
      if (playerWinMove) {
        this.gameState.markBox(playerWinMove, 'x', true);
      } else {
        const surroundingCorners = this.gameState.surroundingCorners.filter( v => v.includes(computerMove));
        const winingCombinations = this.gameState.filterWinCombinations(game.playerTurns).filter( v =>
          (v.includes(surroundingCorners[0][0]) && v.includes(computerMove2)) ||
          (v.includes(surroundingCorners[1][0]) && v.includes(computerMove2))
        );
        const corner = winingCombinations[0].filter( v => this.gameState.corners.includes(v) && v !== computerMove2)[0];
        this.gameState.markBox(corner, 'x', true);
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        const playerWinMove = this.gameState.getWinMove(false);
        if (playerWinMove) {
          this.gameState.markBox(playerWinMove, 'x', true);
        } else {
          if (this.gameState.middles.includes(playerMove)) {
            const corner = this.gameState.surroundingCorners.filter( v => v.includes(computerMove3) && v.includes(computerMove))[0][0];
            this.gameState.markBox(corner, 'x', true);
          } else {
            this.gameState.markBox(this.gameState.randomEmptyBox(), 'x', true);
          }
        }
      }
    }
    if (game.turn === 9) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        this.gameState.markBox(this.gameState.randomEmptyBox(), 'x', true);
        this.gameState.endRound(false);
      }
    }
  }

  midCornerStrategy() {
    const game = this.gameState.gameStatus.getValue();
    const playerMove = game.playerTurns[0];
    const computerMove = game.computerTurns[0];
    if (game.turn === 3) {
      const surroundingCorners = this.gameState.surroundingCorners.filter( v => v.includes(playerMove) && !v.includes(computerMove));
      if (surroundingCorners.length) {
        // Far corner
        const crossWiningCombinations = this.gameState.winingCombinations.filter( (_, i, arr) => i > arr.length - 3);
        const crossCombination = crossWiningCombinations.filter( v => !v.includes(playerMove))[0];
        let surroundingCorners2 = this.gameState.surroundingCorners.filter( v => v.includes(computerMove));
        surroundingCorners2 = surroundingCorners2.filter( v => v.includes(crossCombination[0]) || v.includes(crossCombination[2]));
        const cornerMove = surroundingCorners2[0][0];
        this.gameState.markBox(cornerMove, 'x', true);
      } else {
        // Close corner
        this.gameState.markBox(5, 'x', true);
      }
    }
    if (game.turn === 5) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        const playerWinMove = this.gameState.getWinMove(false);
        if (playerWinMove) {
          this.gameState.markBox(playerWinMove, 'x', true);
        } else {
          this.gameState.markBox(this.gameState.randomEmptyBox(true), 'x', true);
        }
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        const playerWinMove = this.gameState.getWinMove(false);
        if (playerWinMove) {
          this.gameState.markBox(playerWinMove, 'x', true);
        } else {
          this.gameState.markBox(this.gameState.randomEmptyBox(), 'x', true);
        }
      }
    }
    if (game.turn === 9) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        this.gameState.markBox(this.gameState.randomEmptyBox(), 'x', true);
        this.gameState.endRound(false);
      }
    }
  }

  midMidStrategy() {
    const game = this.gameState.gameStatus.getValue();
    if (game.turn === 3) {
      this.gameState.markBox(5, 'x', true);
    }
    if (game.turn === 5) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        const playerMove1 = game.playerTurns[0];
        const playerMove2 = game.playerTurns[1];
        if (this.gameState.middles.includes(playerMove2)) {
          const corner = this.gameState.surroundingCorners.filter( v => !v.includes(playerMove1) && !v.includes(playerMove2))[0][0];
          this.gameState.markBox(corner, 'x', true);
        } else {
          const playerWinMove = this.gameState.getWinMove(false);
          if (playerWinMove) {
            this.gameState.markBox(playerWinMove, 'x', true);
          } else {
            const winingCombinations = this.gameState.filterWinCombinations(game.computerTurns);
            const winComb = winingCombinations.filter( v => v.includes(playerMove2))[0];
            const move = winComb.filter( v => v !== playerMove2 && this.gameState.corners.includes(v))[0];
            this.gameState.markBox(move, 'x', true);
          }
        }
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        this.gameState.markBox(this.gameState.randomEmptyBox(true), 'x', true);
      }
    }
    if (game.turn === 9) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        this.gameState.markBox(this.gameState.randomEmptyBox(), 'x', true);
        this.gameState.endRound(false);
      }
    }
  }

  cornerCenterStrategy() {
    const game = this.gameState.gameStatus.getValue();
    const computerFirstTurn = game.computerTurns[0];
    if (game.turn === 3) {
      const oppositeCorners = this.gameState.oppositeCorners.filter( v => v.includes(computerFirstTurn));
      const oppositeCorner = oppositeCorners[0].filter( v => v !== computerFirstTurn)[0];
      const surroundingCorners = this.gameState.surroundingCorners.filter( v => v.includes(oppositeCorner))[0];
      const item = surroundingCorners[Math.floor(Math.random() * surroundingCorners.length)];
      this.gameState.markBox(item, 'x', true);
    }
    if (game.turn === 5) {
      const playerWinMove = this.gameState.getWinMove(false);
      if (playerWinMove) {
        this.gameState.markBox(playerWinMove, 'x', true);
      } else {
        let winingCombinations = this.gameState.filterWinCombinations(game.playerTurns);
        winingCombinations = winingCombinations.filter( v => v.includes(computerFirstTurn));
        if (winingCombinations.length === 1) {
          const box = winingCombinations[0].filter( v => this.gameState.corners.includes(v) && v !== computerFirstTurn)[0];
          this.gameState.markBox(box, 'x', true);
        } else {
          const computerSecondMove = game.computerTurns[1];
          const playerSecondMove = game.playerTurns[1];
          const surroundingCorners = this.gameState.surroundingCorners.filter(
            v => v.includes(computerSecondMove) && !v.includes(playerSecondMove)
          );
          this.gameState.markBox(surroundingCorners[0][0], 'x', true);
        }
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        const playerWinMove = this.gameState.getWinMove(false);
        playerWinMove ?
          this.gameState.markBox(playerWinMove, 'x', true) : this.gameState.markBox(this.gameState.randomEmptyBox(), 'x', true);
      }
    }
    if (game.turn === 9) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        this.gameState.markBox(this.gameState.randomEmptyBox(), 'x', true);
        this.gameState.endRound(false);
      }
    }
  }

  cornerMidStrategy() {
    const game = this.gameState.gameStatus.getValue();
    if (game.turn === 3) {
      this.gameState.markBox(5, 'x', true);
    }
    if (game.turn === 5) {
      const playerWinMove = this.gameState.getWinMove(false);
      if (playerWinMove) {
        this.gameState.markBox(playerWinMove, 'x', true);
      } else {
        const playerMove1 = game.playerTurns[0];
        const playerMove2 = game.playerTurns[1];
        const surroundingCorners = this.gameState.surroundingCorners.filter( v => !v.includes(playerMove1) && !v.includes(playerMove2));
        this.gameState.markBox(surroundingCorners[0][0], 'x', true);
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.gameState.getWinMove(true);
      this.gameState.markBox(computerWinMove, 'x', true);
      this.gameState.endRound(true);
    }
  }

  cornerCornerStrategy() {
    const game = this.gameState.gameStatus.getValue();
    if (game.turn === 3) {
      const corners = this.gameState.corners.filter( v => !game.computerTurns.includes(v) && !game.playerTurns.includes(v));
      const item = corners[Math.floor(Math.random() * corners.length)];
      this.gameState.markBox(item, 'x', true);
    }
    if (game.turn === 5) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        const corners = this.gameState.corners.filter( v => !game.computerTurns.includes(v) && !game.playerTurns.includes(v));
        const item = corners[Math.floor(Math.random() * corners.length)];
        this.gameState.markBox(item, 'x', true);
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.gameState.getWinMove(true);
      this.gameState.markBox(computerWinMove, 'x', true);
      this.gameState.endRound(true);
    }
  }

  centerCornerCornerTurn() {
    const game = this.gameState.gameStatus.getValue();
    if (game.turn === 5) {
      const playerWinMove = this.gameState.getWinMove(false);
      this.gameState.markBox(playerWinMove, 'x', true);
    }
    if (game.turn === 7) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        const emptyBox = this.gameState.randomEmptyBox(true);
        this.gameState.markBox(emptyBox, 'x', true);
      }
    }
    if (game.turn === 9) {
      const computerWinMove = this.gameState.getWinMove(true);
      if (computerWinMove) {
        this.gameState.markBox(computerWinMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        const emptyBox = this.gameState.randomEmptyBox();
        this.gameState.markBox(emptyBox, 'x', true);
        this.gameState.endRound(false);
      }
    }
  }

  centerCornerMidTurn() {
    const game = this.gameState.gameStatus.getValue();
    if (game.turn === 5) {
      const playerWinMove = this.gameState.getWinMove(false);
      if (playerWinMove) {
        this.gameState.markBox(playerWinMove, 'x', true);
      } else {
        let surroundingCorners = [...this.gameState.surroundingCorners];
        surroundingCorners = surroundingCorners.filter( v => !(v.includes(game.playerTurns[1]) || v.includes(game.playerTurns[0])) );
        this.gameState.markBox(surroundingCorners[0][0], 'x', true);
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.gameState.getWinMove(true);
      this.gameState.markBox(computerWinMove, 'x', true);
      this.gameState.endRound(true);
    }
  }

  centerCornerTurn() {
    const game = this.gameState.gameStatus.getValue();
    if (game.turn === 3) {
      let oppositeCorners = [
        [1, 9],
        [3, 7]
      ];
      oppositeCorners = oppositeCorners.filter( v => v.includes(game.playerTurns[0]));
      const oppositeCornerBox = oppositeCorners[0].filter( v => v !== game.playerTurns[0])[0];
      this.gameState.markBox(oppositeCornerBox, 'x', true);
    }
  }

  centerMidTurn() {
    const game = this.gameState.gameStatus.getValue();
    if (game.turn === 3) {
      const item = this.gameState.corners[Math.floor(Math.random() * this.gameState.corners.length)];
      this.gameState.markBox(item, 'x', true);
    }
    if (game.turn === 5) {
      const winingCombinations = [
        [1, 9],
        [3, 7]
      ];
      const secondMove = game.computerTurns[1];
      const getRightCombination = winingCombinations.filter( v => v.includes(secondMove))[0];
      const winMove = getRightCombination.filter( v => v !== secondMove)[0];
      if (!game.playerTurns.includes(winMove)) {
        this.gameState.markBox(winMove, 'x', true);
        this.gameState.endRound(true);
      } else {
        // Check if user is going to make a win with his next move and block it
        const playerWinMove = this.gameState.getWinMove(false);
        if (playerWinMove) {
          this.gameState.markBox(playerWinMove, 'x', true);
        } else {
          // Place the chess mate move
          let surroundingCorners = [...this.gameState.surroundingCorners];

          // Get the right corner and mark it
          const playerCorner = game.playerTurns[1];
          const playerFirstTurn = game.playerTurns[0];
          const computerCorner = game.computerTurns[1];
          surroundingCorners = surroundingCorners.filter(v => !v.includes(playerCorner) && !v.includes(computerCorner));
          surroundingCorners = surroundingCorners.filter( v => !v.includes(playerFirstTurn));
          this.gameState.markBox(surroundingCorners[0][0], 'x', true);
        }
      }
    }
    if (game.turn === 7) {
      let winCombinations = [...this.gameState.winingCombinations];
      winCombinations = winCombinations.filter( v =>
        !(v.includes(game.playerTurns[0]) || v.includes(game.playerTurns[1]) || v.includes(game.playerTurns[2]))
      );
      const winMove = this.gameState.getWinMove(true);
      this.gameState.markBox(winMove, 'x', true);
      this.gameState.endRound(true);
    }
  }
}
