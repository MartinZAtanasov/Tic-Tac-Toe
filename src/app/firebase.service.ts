import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { GameStateService } from './game-state.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, exhaustMap } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private fireAuth: AngularFireAuth, private gameState: GameStateService, private fireStore: AngularFirestore) { }

  saveResult(): Observable<Promise<void>> {
    return this.fireAuth.idTokenResult.pipe(
      map( token =>  {
        const game = this.gameState.gameStatus.getValue();
        const userID = token.claims.user_id;
        const picture = token.claims.picture;
        const playerScore = game.playerScore;
        const computerScore = game.computerScore;
        const name = token.claims.name ? this.trimName(token.claims.name) : 'Anonymous';

        let payLoad = {}
        if (picture) {
          payLoad = {name, picture, playerScore, computerScore};
        } else {
          payLoad = {name, playerScore, computerScore};
        }

        return this.fireStore.doc(`users/${userID}`).set(payLoad);
      })
    )
  }
  deleteResult() {
    return this.fireAuth.user.pipe(
      exhaustMap( user => {
        if (user) {
          const doc = this.fireStore.doc(`users/${user.uid}`).get();
          return forkJoin(of(user), doc);
        } else {
          return of(null);
        }
      }),
      map( res => {
        const promises: Promise<any>[] = [];
        if (res) {
        if (res[1].exists) {
          promises.push(this.fireStore.doc(`users/${res[0].uid}`).delete());
        }
        promises.push(res[0].delete());
        return Promise.all(promises);
        } else {
          return null;
        }
      })
    )
  }

  private trimName(name: string): string {
    return name.split(' ')[0];
  }
}
