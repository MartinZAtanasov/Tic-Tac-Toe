import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css'],
})
export class BoxComponent implements OnInit {

  constructor(private gameService: GameService) { }

  @Input() index: number;
  computerTurn = false;
  markedType: string;


  ngOnInit() {
    this.gameService.gameStatus.subscribe( game => {
      const box = game.boardBoxes[this.index - 1];
      this.markedType = box.markType;
    });
  }

  onClick(): void {
    if (!this.markedType) {
      this.gameService.markBox(this.index, 'o', false);
      this.gameService.computerTurn();
    }
  }
}
