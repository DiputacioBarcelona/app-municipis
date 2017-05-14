import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class UserData {
  private favorites: string[] = [];
  private FAVOURITES = 'favorites';

  constructor(
    public storage: Storage
  ) {
    this.getData().then((data) => {
      if(data) {
        this.favorites = JSON.parse(data);
      }
    });
  }

  private getData() {
    return this.storage.get(this.FAVOURITES);  
  }
 
  private save() {
    let newData = JSON.stringify(this.favorites);
    this.storage.set(this.FAVOURITES, newData);
  }

  hasFavorite(municipiINE: string): boolean {    
    return (this.favorites.indexOf(municipiINE) > -1);
  }

  addFavorite(municipiINE: string): void {    
    this.favorites.push(municipiINE);
    this.save();
  }

  removeFavorite(municipiINE: string): void {    
    let index = this.favorites.indexOf(municipiINE);    
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.save();
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
