import { Component, OnInit } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { ComputerFirstStrategiesService } from '../computer-first-strategies.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  constructor(private gameState: GameStateService, private computerFirst: ComputerFirstStrategiesService) { }

  ngOnInit() {
  }

  // onComputerStarts() {
  //   this.computerFirst.computerTurn();
  //   const game = this.gameState.gameStatus.getValue();
  //   this.gameState.gameStatus.next({...game, computerStarts: true});
  // }
}
