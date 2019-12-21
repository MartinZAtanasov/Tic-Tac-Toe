import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mini-box',
  templateUrl: './mini-box.component.html',
  styleUrls: ['./mini-box.component.css']
})
export class MiniBoxComponent implements OnInit {

  constructor() { }

  @Input() index: number;
  @Input() miniBoard: any[];

  markedType: string;

  ngOnInit() {
  }

}
