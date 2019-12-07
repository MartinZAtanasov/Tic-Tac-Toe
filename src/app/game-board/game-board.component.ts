import { GameService } from './../game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit() {
    // Check if computer turn and mark mid
    this.gameService.gameStatus.subscribe( game => {
      if (game.computerTurn) {
        this.gameService.computerTurn();
      }
    });
  }
}
