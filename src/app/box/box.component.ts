import { GameStateService } from './../game-state.service';
import { PlayerFirstStrategiesService } from './../player-first-strategies.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ComputerFirstStrategiesService } from '../computer-first-strategies.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css'],
})
export class BoxComponent implements OnInit, OnDestroy {

  constructor(
    private playerFirst: PlayerFirstStrategiesService,
    private gameState: GameStateService,
    private computerFirst: ComputerFirstStrategiesService
  ) { }

  @Input() index: number;
  computerStarts: boolean;
  markedType: string;
  gameOn: boolean;
  subscription: Subscription;


  ngOnInit() {
    this.subscription = this.gameState.gameStatus.subscribe( game => {
      const box = game.boardBoxes[this.index - 1];
      this.markedType = box.markType;
      this.computerStarts = game.computerStarts;
      this.gameOn = game.gameOn;
    });
  }

  onClick(): void {
    if (this.gameOn && !this.markedType) {
      const mark = this.computerStarts ? 'o' : 'x';
      if (this.computerStarts) {
        this.gameState.markBox(this.index, mark, false);
        this.computerFirst.computerTurn();
      } else {
        this.gameState.markBox(this.index, mark, false);
        this.playerFirst.computerTurn();
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
