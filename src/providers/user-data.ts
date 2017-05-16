import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class UserData {
  private municipisMUNICIPIS_FAVOURITES: string[] = [];
  private MUNICIPIS_FAVOURITES = 'municipisMUNICIPIS_FAVOURITES';

  constructor(
    public storage: Storage
  ) {
    this.getDataMunicipis().then((data) => {
      if(data) {
        this.municipisMUNICIPIS_FAVOURITES = JSON.parse(data);
      }
    });
  }

  private getDataMunicipis() {
    return this.storage.get(this.MUNICIPIS_FAVOURITES);  
  }
 
  private saveMunicipis() {
    let newData = JSON.stringify(this.municipisMUNICIPIS_FAVOURITES);
    this.storage.set(this.MUNICIPIS_FAVOURITES, newData);
  }

  hasFavoriteMunicipis(municipiINE: string): boolean {    
    return (this.municipisMUNICIPIS_FAVOURITES.indexOf(municipiINE) > -1);
  }

  addFavoriteMunicipis(municipiINE: string): void {    
    this.municipisMUNICIPIS_FAVOURITES.push(municipiINE);
    this.saveMunicipis();
  }

  removeFavoriteMunicipis(municipiINE: string): void {    
    let index = this.municipisMUNICIPIS_FAVOURITES.indexOf(municipiINE);    
    if (index > -1) {
      this.municipisMUNICIPIS_FAVOURITES.splice(index, 1);
      this.saveMunicipis();
    }
  }

}
