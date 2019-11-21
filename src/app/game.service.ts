import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  gameStatus = new BehaviorSubject({
    gameOn: true,
    computerTurn: true,
    turn: 1,
    boardBoxes: [
      {id: 1, marked: false, markType: null},
      {id: 2, marked: false, markType: null},
      {id: 3, marked: false, markType: null},
      {id: 4, marked: false, markType: null},
      {id: 5, marked: false, markType: null},
      {id: 6, marked: false, markType: null},
      {id: 7, marked: false, markType: null},
      {id: 8, marked: false, markType: null},
      {id: 9, marked: false, markType: null},
    ]
  });

  markBox(index?: number, type?: string) {
    console.log({...this.gameStatus});
  }
}
