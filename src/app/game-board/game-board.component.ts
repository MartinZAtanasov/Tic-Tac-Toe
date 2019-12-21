import { PlayerFirstStrategiesService } from './../player-first-strategies.service';
import { Component, OnInit } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { ComputerFirstStrategiesService } from '../computer-first-strategies.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
