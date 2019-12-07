import { Component, OnInit } from '@angular/core';
import { popMark } from '../animations';

@Component({
  selector: 'app-o-mark',
  templateUrl: './o-mark.component.html',
  styleUrls: ['./o-mark.component.css'],
  animations: [popMark]
})
export class OMarkComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
