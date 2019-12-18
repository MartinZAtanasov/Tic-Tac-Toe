import { GameStateService } from './../game-state.service';
import { PlayerFirstStrategiesService } from './../player-first-strategies.service';
import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css'],
})
export class BoxComponent implements OnInit {

  constructor(
    private gameService: GameService,
    private playerFirstStrategies: PlayerFirstStrategiesService,
    private gameState: GameStateService
  ) { }

  @Input() index: number;
  computerStarts: boolean;
  markedType: string;


  ngOnInit() {
    // this.gameService.gameStatus.subscribe( game => {
    //   const box = game.boardBoxes[this.index - 1];
    //   this.markedType = box.markType;
    //   this.computerStarts = game.computerStarts;
    // });
    this.gameState.gameStatus.subscribe( game => {
      const box = game.boardBoxes[this.index - 1];
      this.markedType = box.markType;
      this.computerStarts = game.computerStarts;
    });
  }

  onClick(): void {
    if (!this.markedType) {
      const mark = this.computerStarts ? 'o' : 'x';
      if (this.computerStarts) {
        this.gameService.markBox(this.index, mark, false);
        this.gameService.computerTurn();
      } else {
        // this.playerFirstStrategies.markBox(this.index, mark, false);
        this.gameState.markBox(this.index, mark, false);
        this.playerFirstStrategies.computerTurn();
      }
    }
  }
}
