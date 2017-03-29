import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'favouritesFilter'
})

@Injectable()
export class FavouritesFilter {
  transform(value) {
    var favourites = [];
    var noFavourites = [];
    for (var i = 0; i < value.length; ++i) {
      if (value[i]['favourite']) favourites.push(value[i]);
      else noFavourites.push(value[i]);
    }
    return favourites.concat(noFavourites);
  }
}
