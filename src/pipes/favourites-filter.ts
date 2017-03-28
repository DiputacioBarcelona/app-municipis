import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'filtraPreferits'
})
@Injectable()
export class FiltraPreferits {
  transform(value) {
    var preferits = [];
    var noPreferits = [];
    for (var i = 0; i < value.length; ++i) {
      if (value[i]['preferit']) preferits.push(value[i]);
      else noPreferits.push(value[i]);
    }
    return preferits.concat(noPreferits);
  }
}
