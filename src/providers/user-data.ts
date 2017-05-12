import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class UserData {
  favorites: string[] = [];

  constructor(
    //TODO: storage
    public storage: Storage
  ) {}

  hasFavorite(municipiINE: string): boolean {    
    return (this.favorites.indexOf(municipiINE) > -1);
  }

  addFavorite(municipiINE: string): void {    
    this.favorites.push(municipiINE);
  }

  removeFavorite(municipiINE: string): void {    
    let index = this.favorites.indexOf(municipiINE);    
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }

  toggleFavourite(municipiINE: string): void {
    if (this.hasFavorite(municipiINE)) {
      this.removeFavorite(municipiINE);
    } else {
      this.addFavorite(municipiINE);
    }
  }

}
