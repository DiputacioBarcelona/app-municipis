import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'municipiUniqueFilter'
})

@Injectable()
export class MunicipiUniqueFilter {
  transform(value, args) {
    return value[args['i']][args['atr']];
  }
}
