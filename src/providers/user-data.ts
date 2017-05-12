import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class UserData {
  private favorites: string[] = [];
  private DATA_LOADED_MUNICIPIS = 'dataLoadedMunicipis';

  constructor(
    public storage: Storage
  ) {
    // this.loadFavoritesFromStorage();
    // console.log('dins el constructor');
  }

  private loadFavoritesFromStorage() {
    return this.storage.get('dataLoadedMunicipis').then((value) => {
      if (value) {
        this.favorites = value;
        console.log('sí que hi ha value: ' + this.favorites);
      }
    });
  };

  hasFavorite(municipiINE: string): boolean {    
    return (this.favorites.indexOf(municipiINE) > -1);
  }

  addFavorite(municipiINE: string): void {    
    this.favorites.push(municipiINE);
    this.storage.set(this.DATA_LOADED_MUNICIPIS, this.favorites);
    this.storage.set("age", 25);
  }

  removeFavorite(municipiINE: string): void {    
    let index = this.favorites.indexOf(municipiINE);    
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.storage.set(this.DATA_LOADED_MUNICIPIS, this.favorites);
      this.storage.set("age", 25);
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
