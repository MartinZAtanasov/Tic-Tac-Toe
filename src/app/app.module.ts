import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { GameBoardComponent } from './game-board/game-board.component';
import { BoxComponent } from './box/box.component';
import { XMarkComponent } from './x-mark/x-mark.component';
import { OMarkComponent } from './o-mark/o-mark.component';
import { environment } from 'src/environments/environment';
import { AuthCardComponent } from './auth-card/auth-card.component';
import { GameInfoComponent } from './game-info/game-info.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    BoxComponent,
    XMarkComponent,
    OMarkComponent,
    AuthCardComponent,
    GameInfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
