import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  constructor() { }

  initState = {
    // gameOn: false,
    turn: 1,
    strategy: null,
    computerStarts: false,
    computerTurns: [],
    playerTurns: [],
    playerScore: 0,
    computerScore: 0,
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
  }

  gameStatus = new BehaviorSubject({
    ...this.initState,
    computerTurns: [...this.initState.computerTurns],
    playerTurns: [...this.initState.playerTurns],
    boardBoxes: [...this.initState.boardBoxes]
  })

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

  private getWiningMark(winCombinations: number[][], turns: number[]): number {
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

  nextRound(computerWins: boolean) {
    const game = this.gameStatus.getValue();
    if (computerWins) {
      this.gameStatus.next({
        ...this.initState,
        computerTurns: [...this.initState.computerTurns],
        playerTurns: [...this.initState.playerTurns],
        boardBoxes: [...this.initState.boardBoxes]
        // Update the game state
      })
    }
  }

}
