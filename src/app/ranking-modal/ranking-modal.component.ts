import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-ranking-modal',
  templateUrl: './ranking-modal.component.html',
  styleUrls: ['./ranking-modal.component.css']
})
export class RankingModalComponent implements OnInit {

  constructor(private fireBase: FirebaseService) { }

  users: Observable<any>;
  @Output() closeRanking: EventEmitter<void> = new EventEmitter();
  @Input() closableRanking: boolean;
  
  ngOnInit() {
    this.users = this.fireBase.getUsers();
  }

  onCloseRanking() {
    this.closeRanking.emit();
  }

}
