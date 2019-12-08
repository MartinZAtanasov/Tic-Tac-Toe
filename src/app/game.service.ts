import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

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
  middle = [2, 4, 6, 8];
  center = [5];

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
      this.gameStatus.next( {...game, strategy: 'center'});
      this.markBox(5, 'x', true);
    }
    switch (game.strategy) {
      case 'center':
        this.strategyTurn();
        break;
      default: break;
    }
  }

  strategyTurn() {
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

        // Check if user is going to make a win with his next move
        winingCombinations = [
          [1, 2, 3],
          [1, 4, 7],
          [3, 6, 9],
          [7, 8, 9]
        ];
        winingCombinations = winingCombinations.filter( v => v.includes(game.playerTurns[0]));
        winingCombinations = winingCombinations.filter( v => v.includes(game.playerTurns[1]));
        if (winingCombinations.length) {
          winMove = winingCombinations[0].filter( v => !game.playerTurns.includes(v))[0];
          this.markBox(winMove, 'x', true);
        } else {
          // Place the chess mate move
        }
      }
    }
  }
}
