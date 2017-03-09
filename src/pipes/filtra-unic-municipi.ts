import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'filtraUnicMunicipi'
})
@Injectable()
export class FiltraUnicMunicipi {
  transform(value, args) {
    return value[args['i']][args['atr']];
  }
}
