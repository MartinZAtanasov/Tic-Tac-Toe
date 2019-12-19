import { GameStateService } from './../game-state.service';
import { Component, OnInit } from '@angular/core';
import { popMark } from '../animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-x-mark',
  templateUrl: './x-mark.component.html',
  styleUrls: ['./x-mark.component.css'],
  animations: [popMark]
})
export class XMarkComponent implements OnInit {

  constructor(private gameState: GameStateService) { }

  game: Observable<any>;

  ngOnInit() {
    this.game = this.gameState.gameStatus;
  }

}
