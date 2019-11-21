import { Component, OnInit } from '@angular/core';
import { popMark } from '../animations';

@Component({
  selector: 'app-x-mark',
  templateUrl: './x-mark.component.html',
  styleUrls: ['./x-mark.component.css'],
  animations: [popMark]
})
export class XMarkComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
