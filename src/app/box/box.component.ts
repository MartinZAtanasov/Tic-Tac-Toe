import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {

  constructor(private gameService: GameService) { }

  @Input() index: number;
  marked = false;
  computerTurn = false;
  markedType: string;


  ngOnInit() {
    this.gameService.gameStatus.subscribe( game => {
      const box = game.boardBoxes[this.index - 1];
      this.marked = box.marked;
      this.markedType = box.markType;
      this.computerTurn = game.computerTurn;
    })
  }

  onClick(): void {
    if (!this.marked) {
      if (this.computerTurn) {
        this.gameService.markBox();
      }
    }
  }

}
