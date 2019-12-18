import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  gameStatus = new BehaviorSubject({
    gameOn: false,
    turn: 1,
    strategy: null,
    computerStarts: false,
    computerTurns: [],
    playerTurns: [],
    boardBoxes: [
      {id: 1, markType: null},
      {id: 2, markType: null},
      {id: 3, markType: null},
      {id: 4, markType: null},
      {id: 5, markType: null},
      {id: 6, markType: null},
      {id: 7, markType: null},
      {id: 8, markType: null},
      {id: 9, markType: null},
    ]
  });

  corners = [1, 3, 7, 9];
  oppositeCorners = [
    [1, 9],
    [3, 7]
  ];
  middles = [2, 4, 6, 8];
  center = [5];
  surroundingCorners = [
    [1, 2, 4],
    [3, 2, 6],
    [7, 4, 8],
    [9, 8, 6]
  ];
  winingCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
  ];

  computerTurn() {
    const game = this.gameStatus.getValue();
    const playerTurn = game.playerTurns[0];
    const computerTurn = game.computerTurns[0];
    if (game.turn === 1) {
      const randomIndex = Math.floor(Math.random() * 3) + 1;
      if (randomIndex === 1) {
        this.markBox(5, 'x', true);
      }
      if (randomIndex === 2) {
        const randomMiddle = this.middles[Math.floor(Math.random() * this.middles.length)];
        this.markBox(randomMiddle, 'x', true);
      }
      if (randomIndex === 3) {
        const randomCorner = this.corners[Math.floor(Math.random() * this.corners.length)];
        this.markBox(randomCorner, 'x', true);
      }
    }
    if (game.turn === 3) {
      // Center strategy
      if (computerTurn === 5) {
        if (this.middles.includes(playerTurn)) {
          this.gameStatus.next( {...game, strategy: 'center-mid'});
        }
        if (this.corners.includes(playerTurn)) {
          this.gameStatus.next( {...game, strategy: 'center-corner'});
        }
      }
      // Corner strategy
      if (this.corners.includes(computerTurn)) {
        if (this.corners.includes(playerTurn)) {
          this.gameStatus.next( {...game, strategy: 'corner-corner'});
        }
        if (this.middles.includes(playerTurn)) {
          this.gameStatus.next( {...game, strategy: 'corner-mid'});
        }
        if (playerTurn === 5) {
          this.gameStatus.next( {...game, strategy: 'corner-center'});
        }
      }
      // Middle strategy
      if (this.middles.includes(computerTurn)) {
        if (this.middles.includes(playerTurn)) {
          this.gameStatus.next( {...game, strategy: 'mid-mid'});
        }
        if (this.corners.includes(playerTurn)) {
          this.gameStatus.next( {...game, strategy: 'mid-corner'});
        }
        if (playerTurn === 5) {
          this.gameStatus.next( {...game, strategy: 'mid-center'});
        }
      }
      this.playStrategy();
    }
    if (game.turn === 5 ) {
      // Center strategy
      if (computerTurn === 5) {
        const isMiddle = this.middles.includes(game.playerTurns[1]);
        if (isMiddle && game.strategy === 'center-corner') {
          this.gameStatus.next( {...game, strategy: 'center-corner-middle'});
        }
        if (!isMiddle && game.strategy === 'center-corner') {
          this.gameStatus.next( {...game, strategy: 'center-corner-corner'});
        }
      }
      this.playStrategy();
    }
    if (game.turn > 5) {
      this.playStrategy();
    }
  }

  playStrategy() {
    const game = this.gameStatus.getValue();
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
    const game = this.gameStatus.getValue();
    const computerMove = game.computerTurns[0];
    const computerMove2 = game.computerTurns[1];
    const computerMove3 = game.computerTurns[2];
    const playerMove = game.playerTurns[1];
    if (game.turn === 3) {
      const surroundingCorners = this.surroundingCorners.filter( v => !v.includes(computerMove));
      const randomIndex = Math.round(Math.random());
      const corner = surroundingCorners[randomIndex][0];
      this.markBox(corner, 'x', true);
    }
    if (game.turn === 5) {
      const playerWinMove = this.getWinMove(false);
      if (playerWinMove) {
        this.markBox(playerWinMove, 'x', true);
      } else {
        const surroundingCorners = this.surroundingCorners.filter( v => v.includes(computerMove));
        const winingCombinations = this.filterWinCombinations(game.playerTurns).filter( v =>
          (v.includes(surroundingCorners[0][0]) && v.includes(computerMove2)) ||
          (v.includes(surroundingCorners[1][0]) && v.includes(computerMove2))
        );
        const corner = winingCombinations[0].filter( v => this.corners.includes(v) && v !== computerMove2)[0];
        this.markBox(corner, 'x', true);
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        const playerWinMove = this.getWinMove(false);
        if (playerWinMove) {
          this.markBox(playerWinMove, 'x', true);
        } else {
          if (this.middles.includes(playerMove)) {
            const corner = this.surroundingCorners.filter( v => v.includes(computerMove3) && v.includes(computerMove))[0][0];
            this.markBox(corner, 'x', true);
          } else {
            this.markBox(this.randomEmptyBox(), 'x', true);
          }
        }
      }
    }
    if (game.turn === 9) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        this.markBox(this.randomEmptyBox(), 'x', true);
        console.log('DRAW');
      }
    }
  }

  midCornerStrategy() {
    const game = this.gameStatus.getValue();
    const playerMove = game.playerTurns[0];
    const computerMove = game.computerTurns[0];
    if (game.turn === 3) {
      const surroundingCorners = this.surroundingCorners.filter( v => v.includes(playerMove) && !v.includes(computerMove));
      if (surroundingCorners.length) {
        // Far corner
        const crossWiningCombinations = this.winingCombinations.filter( (_, i, arr) => i > arr.length - 3);
        const crossCombination = crossWiningCombinations.filter( v => !v.includes(playerMove))[0];
        let surroundingCorners2 = this.surroundingCorners.filter( v => v.includes(computerMove));
        surroundingCorners2 = surroundingCorners2.filter( v => v.includes(crossCombination[0]) || v.includes(crossCombination[2]));
        const cornerMove = surroundingCorners2[0][0];
        this.markBox(cornerMove, 'x', true);
      } else {
        // Close corner
        this.markBox(5, 'x', true);
      }
    }
    if (game.turn === 5) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        const playerWinMove = this.getWinMove(false);
        if (playerWinMove) {
          this.markBox(playerWinMove, 'x', true);
        } else {
          this.markBox(this.randomEmptyBox(true), 'x', true);
        }
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        const playerWinMove = this.getWinMove(false);
        if (playerWinMove) {
          this.markBox(playerWinMove, 'x', true);
        } else {
          this.markBox(this.randomEmptyBox(), 'x', true);
        }
      }
    }
    if (game.turn === 9) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        this.markBox(this.randomEmptyBox(), 'x', true);
        console.log('DRAW');
      }
    }
  }

  midMidStrategy() {
    const game = this.gameStatus.getValue();
    if (game.turn === 3) {
      this.markBox(5, 'x', true);
    }
    if (game.turn === 5) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        const playerMove1 = game.playerTurns[0];
        const playerMove2 = game.playerTurns[1];
        if (this.middles.includes(playerMove2)) {
          const corner = this.surroundingCorners.filter( v => !v.includes(playerMove1) && !v.includes(playerMove2))[0][0];
          this.markBox(corner, 'x', true);
        } else {
          const playerWinMove = this.getWinMove(false);
          if (playerWinMove) {
            this.markBox(playerWinMove, 'x', true);
          } else {
            const winingCombinations = this.filterWinCombinations(game.computerTurns);
            const winComb = winingCombinations.filter( v => v.includes(playerMove2))[0];
            const move = winComb.filter( v => v !== playerMove2 && this.corners.includes(v))[0];
            this.markBox(move, 'x', true);
          }
        }
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        this.markBox(this.randomEmptyBox(true), 'x', true);
      }
    }
    if (game.turn === 9) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        this.markBox(this.randomEmptyBox(), 'x', true);
        console.log('DRAW');
      }
    }
  }

  cornerCenterStrategy() {
    const game = this.gameStatus.getValue();
    const computerFirstTurn = game.computerTurns[0];
    if (game.turn === 3) {
      const oppositeCorners = this.oppositeCorners.filter( v => v.includes(computerFirstTurn));
      const oppositeCorner = oppositeCorners[0].filter( v => v !== computerFirstTurn)[0];
      const surroundingCorners = this.surroundingCorners.filter( v => v.includes(oppositeCorner))[0];
      const item = surroundingCorners[Math.floor(Math.random() * surroundingCorners.length)];
      this.markBox(item, 'x', true);
    }
    if (game.turn === 5) {
      const playerWinMove = this.getWinMove(false);
      if (playerWinMove) {
        this.markBox(playerWinMove, 'x', true);
      } else {
        let winingCombinations = this.filterWinCombinations(game.playerTurns);
        winingCombinations = winingCombinations.filter( v => v.includes(computerFirstTurn));
        if (winingCombinations.length === 1) {
          const box = winingCombinations[0].filter( v => this.corners.includes(v) && v !== computerFirstTurn)[0];
          this.markBox(box, 'x', true);
        } else {
          const computerSecondMove = game.computerTurns[1];
          const playerSecondMove = game.playerTurns[1];
          const surroundingCorners = this.surroundingCorners.filter( v => v.includes(computerSecondMove) && !v.includes(playerSecondMove));
          this.markBox(surroundingCorners[0][0], 'x', true);
        }
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        const playerWinMove = this.getWinMove(false);
        playerWinMove ? this.markBox(playerWinMove, 'x', true) : this.markBox(this.randomEmptyBox(), 'x', true);
      }
    }
    if (game.turn === 9) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        this.markBox(this.randomEmptyBox(), 'x', true);
        console.log('DRAW');
      }
    }
  }

  cornerMidStrategy() {
    const game = this.gameStatus.getValue();
    if (game.turn === 3) {
      this.markBox(5, 'x', true);
    }
    if (game.turn === 5) {
      const playerWinMove = this.getWinMove(false);
      if (playerWinMove) {
        this.markBox(playerWinMove, 'x', true);
      } else {
        const playerMove1 = game.playerTurns[0];
        const playerMove2 = game.playerTurns[1];
        const surroundingCorners = this.surroundingCorners.filter( v => !v.includes(playerMove1) && !v.includes(playerMove2));
        this.markBox(surroundingCorners[0][0], 'x', true);
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.getWinMove(true);
      this.markBox(computerWinMove, 'x', true);
      console.log('COMPUTER WINS');
    }
  }

  cornerCornerStrategy() {
    const game = this.gameStatus.getValue();
    if (game.turn === 3) {
      const corners = this.corners.filter( v => !game.computerTurns.includes(v) && !game.playerTurns.includes(v));
      const item = corners[Math.floor(Math.random() * corners.length)];
      this.markBox(item, 'x', true);
    }
    if (game.turn === 5) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        const corners = this.corners.filter( v => !game.computerTurns.includes(v) && !game.playerTurns.includes(v));
        const item = corners[Math.floor(Math.random() * corners.length)];
        this.markBox(item, 'x', true);
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.getWinMove(true);
      this.markBox(computerWinMove, 'x', true);
      console.log('COMPUTER WINS');
    }
  }

  centerCornerCornerTurn() {
    const game = this.gameStatus.getValue();
    if (game.turn === 5) {
      const playerWinMove = this.getWinMove(false);
      this.markBox(playerWinMove, 'x', true);
    }
    if (game.turn === 7) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        const emptyBox = this.randomEmptyBox(true);
        this.markBox(emptyBox, 'x', true);
      }
    }
    if (game.turn === 9) {
      const computerWinMove = this.getWinMove(true);
      if (computerWinMove) {
        this.markBox(computerWinMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        const emptyBox = this.randomEmptyBox();
        this.markBox(emptyBox, 'x', true);
        console.log('DRAW');
      }
    }
  }

  centerCornerMidTurn() {
    const game = this.gameStatus.getValue();
    if (game.turn === 5) {
      const playerWinMove = this.getWinMove(false);
      if (playerWinMove) {
        this.markBox(playerWinMove, 'x', true);
      } else {
        let surroundingCorners = [...this.surroundingCorners];
        surroundingCorners = surroundingCorners.filter( v => !(v.includes(game.playerTurns[1]) || v.includes(game.playerTurns[0])) );
        this.markBox(surroundingCorners[0][0], 'x', true);
      }
    }
    if (game.turn === 7) {
      const computerWinMove = this.getWinMove(true);
      this.markBox(computerWinMove, 'x', true);
      console.log('COMPUTER WINS');
    }
  }

  centerCornerTurn() {
    const game = this.gameStatus.getValue();
    if (game.turn === 3) {
      let oppositeCorners = [
        [1, 9],
        [3, 7]
      ];
      oppositeCorners = oppositeCorners.filter( v => v.includes(game.playerTurns[0]));
      const oppositeCornerBox = oppositeCorners[0].filter( v => v !== game.playerTurns[0])[0];
      this.markBox(oppositeCornerBox, 'x', true);
    }
  }

  centerMidTurn() {
    const game = this.gameStatus.getValue();
    if (game.turn === 3) {
      const item = this.corners[Math.floor(Math.random() * this.corners.length)];
      this.markBox(item, 'x', true);
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
        this.markBox(winMove, 'x', true);
        console.log('COMPUTER WINS');
      } else {
        // Check if user is going to make a win with his next move and block it
        const playerWinMove = this.getWinMove(false);
        if (playerWinMove) {
          this.markBox(playerWinMove, 'x', true);
        } else {
          // Place the chess mate move
          let surroundingCorners = [...this.surroundingCorners];

          // Get the right corner and mark it
          const playerCorner = game.playerTurns[1];
          const playerFirstTurn = game.playerTurns[0];
          const computerCorner = game.computerTurns[1];
          surroundingCorners = surroundingCorners.filter(v => !v.includes(playerCorner) && !v.includes(computerCorner));
          surroundingCorners = surroundingCorners.filter( v => !v.includes(playerFirstTurn));
          this.markBox(surroundingCorners[0][0], 'x', true);
        }
      }
    }
    if (game.turn === 7) {
      let winCombinations = [...this.winingCombinations];
      winCombinations = winCombinations.filter( v =>
        !(v.includes(game.playerTurns[0]) || v.includes(game.playerTurns[1]) || v.includes(game.playerTurns[2]))
      );
      const winMove = this.getWiningMark(winCombinations, game.computerTurns);
      this.markBox(winMove, 'x', true);
      console.log('COMPUTER WINS');
    }
  }

  getWiningMark(winCombinations: number[][], turns: number[]): number {
    turns = [...turns].sort();
    let matches = 0;
    let winComb = null;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < winCombinations.length; i++) {
      winCombinations[i].forEach( value => {
        turns.includes(value) ? matches++ : matches += 0;
    });
      if (matches === 2) {
        winComb = winCombinations[i];
        break;
      } else {
        matches = 0;
        winComb = null;
      }
    }
    const winMove = winComb ? winComb.filter( v => !turns.includes(v))[0] : 0;
    return winMove;
  }

  filterWinCombinations(turns: number[]): number[][] {
    let winingCombinations = [...this.winingCombinations];
    turns.forEach( v => {
      winingCombinations = winingCombinations.filter( value => !value.includes(v));
    });
    return winingCombinations;
  }

  getWinMove(forComputer: boolean): number {
    const game = this.gameStatus.getValue();
    const turns = forComputer ? game.computerTurns : game.playerTurns;
    const oppositeTurns = forComputer ? game.playerTurns : game.computerTurns;
    const winingCombinations = this.filterWinCombinations(oppositeTurns);
    const winMove = this.getWiningMark(winingCombinations, turns);
    return winMove;
  }

  randomEmptyBox(isMiddle?: boolean, isCorner?: boolean): number {
    const game = this.gameStatus.getValue();
    let boxes = game.boardBoxes.filter( v => !v.markType);
    if (isMiddle) {
      boxes = boxes.filter( v => this.middles.includes(v.id));
    }
    if (isCorner) {
      boxes = boxes.filter( v => this.corners.includes(v.id));
    }
    const emptyBox = boxes[Math.floor(Math.random() * boxes.length)];
    return emptyBox.id;
  }

  markBox(index: number, markType: string, computerTurn: boolean) {
    const game = this.gameStatus.getValue();
    const boardBoxes = {...game}.boardBoxes;
    boardBoxes[index - 1].markType = markType;
    computerTurn ? game.computerTurns.push(index) : game.playerTurns.push(index);
    this.gameStatus.next({
      ...game,
      turn: game.turn += 1,
      boardBoxes
    });
  }

}
