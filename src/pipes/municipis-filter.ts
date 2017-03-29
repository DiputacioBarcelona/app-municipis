import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'municipisFilter'
})

@Injectable()
export class MunicipisFilter {
  // Filter the municipalities according to the search page or have been entered
  transform(value, args) {
    var result = [];
    if (value[0] != undefined && args['numElements']) {
      if (args['filter'][0] == undefined) {
        result = [];
        let numElements = args['numElements'] > value.length ? value.length : args['numElements'];
        for (var i = 0; i < value.length; ++i) {
          if (value[i]['favourite']) {
            result.push(value[i]);
          } 
          else {
            if (numElements > 0) {
              result.push(value[i]);
              --numElements;
            }
          }
        }
      }
      else {
        if (args['filter'].length > 0 && args['filter'][0] == -1) {
          return [];
        }
        else {
          for (var i = 0; i < args['filter'].length; ++i) {
            result.push(value[args['filter'][i]]);
          }
        }
      }
    }
    else {
      result = value;
    }
    return result;
  }
}
