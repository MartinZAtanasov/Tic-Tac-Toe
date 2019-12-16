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
  middles = [2, 4, 6, 8];
  center = [5];
  surroundingCorners = [
    [1, 2, 4],
    [3, 2, 6],
    [7, 4, 8],
    [9, 8, 6]
  ]
  winingCombinations = [
    [1, 2, 3],
    [3, 6, 9],
    [7, 8, 9],
    [1, 4, 7],
    [1, 5, 9],
    [3, 5, 7]
  ];

  markBox(index: number, markType: string, computerTurn: boolean) {
    const game = this.gameStatus.getValue();
    // Update the boxes
    const boardBoxes = {...game}.boardBoxes;
    boardBoxes[index - 1].markType = markType;
    // Update the played turns
    computerTurn ? game.computerTurns.push(index) : game.playerTurns.push(index);
    // Update the game status
    this.gameStatus.next({
      ...game,
      turn: game.turn += 1,
      boardBoxes
    });
  }

  computerTurn() {
    const game = this.gameStatus.getValue();
    if (game.turn === 1) {
      this.markBox(5, 'x', true);
    }
    if (game.turn === 3) {
      const playerTurn = game.playerTurns[0];
      // Get the right strategy
      if (this.middles.includes(playerTurn)) {
        this.gameStatus.next( {...game, strategy: 'center-mid'});
        this.centerMidTurn();
      }
      if (this.corners.includes(playerTurn)) {
        this.gameStatus.next( {...game, strategy: 'center-corner'});
        this.centerCornerTurn();
      }
    }
    if (game.turn === 5) {
      const isMiddle = this.middles.includes(game.playerTurns[1]);
      if (isMiddle) {
        this.gameStatus.next( {...game, strategy: 'center-corner-middle'});
        this.centerCornerMidTurn();
      }
    }
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
      default: break;
    }
  }

  centerCornerMidTurn() {
    const game = this.gameStatus.getValue();
    if (game.turn === 5) {
      const playerWinMove = this.getWiningMark(this.winingCombinations, game.playerTurns);
      if (playerWinMove) {
        this.markBox(playerWinMove, 'x', true);
      } else {
        // if player will not score
      }
    }

    if (game.turn === 7) {
      // Need to filter the array from player turns
      let winingCombinations = [...this.winingCombinations];
      const winMove = this.getWiningMark(this.winingCombinations, game.computerTurns);
      console.log(winMove);
      // this.markBox(winMove, 'x', true);
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
      /**Play center-mid strategy second move.
       * Mark a random corner box.
       */
      const item = this.corners[Math.floor(Math.random() * this.corners.length)];
      this.markBox(item, 'x', true);
    }

    if (game.turn === 5) {
      /**Next move can be a win.
       * Find it and place it if the box is not marked by the player
       */
      let winingCombinations = [
        [1, 9],
        [3, 7]
      ];
      const secondMove = game.computerTurns[1];
      const getRightCombination = winingCombinations.filter( v => v.includes(secondMove))[0];
      let winMove = getRightCombination.filter( v => v !== secondMove)[0];
      if (!game.playerTurns.includes(winMove)) {
        this.markBox(winMove, 'x', true);
      } else {
        // If user have marked the win box ->

        // Check if user is going to make a win with his next move and block it
        winingCombinations = [...this.winingCombinations];
        const playerWinMove = this.getWiningMark(winingCombinations, game.playerTurns);
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
      let winMove = this.getWiningMark(winCombinations, game.computerTurns);
      this.markBox(winMove, 'x', true);
    }
  }

  getWiningMark(winCombinations: number[][], turns: number[]): number {
    turns = turns.sort();
    let matches = 0;
    let winComb = null;
    for (let i=0; i < winCombinations.length; i++) {
      winCombinations[i].forEach( value => {
        turns.includes(value) ? matches++ : matches += 0;
      })
      if (matches === 2) {
        winComb = winCombinations[i];
        break;
      } else {
        matches = 0;
        winComb = null;
      }
    }
    let winMove = winComb ? winComb.filter( v => !turns.includes(v))[0] : 0;
    return winMove;
  }
}
