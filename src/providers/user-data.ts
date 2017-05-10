import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public storage: Storage
  ) {}

  hasFavorite(municipiINE: string): boolean {
    console.log('hasFavorite: '+ municipiINE);
    return (this._favorites.indexOf(municipiINE) > -1);
  }

  addFavorite(municipiINE: string): void {
    console.log('addFavorite: '+ municipiINE);
    this._favorites.push(municipiINE);
  }

  removeFavorite(municipiINE: string): void {
    console.log('removeFavorite: '+ municipiINE);
    let index = this._favorites.indexOf(municipiINE);
    console.log('removeFavorite: '+ municipiINE);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }

  toggleFavourite(municipiINE: string): void {
    if (this.hasFavorite(municipiINE)) {
      this.removeFavorite(municipiINE);
    } else {
      this.addFavorite(municipiINE);
    }
  }

  // checkHasSeenTutorial(): Promise<string> {
  //   return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
  //     return value;
  //   });
  // }
}
