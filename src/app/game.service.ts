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
    computerTurn: null,
    turn: 1,
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

  markBox(index: number, markType: string) {
    this.gameStatus.pipe(take(1)).subscribe( gameStatus => {

      // Update the boxes
      const boardBoxes = {...gameStatus}.boardBoxes;
      boardBoxes[index - 1].markType = markType;

      // Update the game status
      this.gameStatus.next({
        ...gameStatus,
        boardBoxes
      });

    });
  }
}
