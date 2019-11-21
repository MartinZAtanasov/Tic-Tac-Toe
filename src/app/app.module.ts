import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GameBoardComponent } from './game-board/game-board.component';
import { BoxComponent } from './box/box.component';
import { XMarkComponent } from './x-mark/x-mark.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    BoxComponent,
    XMarkComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
