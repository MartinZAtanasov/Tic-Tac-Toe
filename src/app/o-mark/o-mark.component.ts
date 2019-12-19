import { GameStateService } from './../game-state.service';
import { Component, OnInit } from '@angular/core';
import { popMark } from '../animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-o-mark',
  templateUrl: './o-mark.component.html',
  styleUrls: ['./o-mark.component.css'],
  animations: [popMark]
})
export class OMarkComponent implements OnInit {

  constructor(private gameState: GameStateService) { }

  game: Observable<any>;

  ngOnInit() {
    this.game = this.gameState.gameStatus;
  }

}
