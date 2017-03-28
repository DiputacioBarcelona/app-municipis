import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'filtraMunicipis'
})

@Injectable()
export class FiltraMunicipis {
  // Filtra els municipis segons la pagina o la cerca que s'hagi introduit
  transform(value, args) {
    var result = [];
    if (value[0] != undefined && args['nbElements']) {
      if (args['filtre'][0] == undefined) {
        result = [];
        let nbElements = args['nbElements'] > value.length ? value.length : args['nbElements'];
        for (var i = 0; i < value.length; ++i) {
          if (value[i]['preferit']) result.push(value[i]);
          else {
            if (nbElements > 0) {
              result.push(value[i]);
              --nbElements;
            }
          }
        }
      }
      else {
        if (args['filtre'].length > 0 && args['filtre'][0] == -1) return [];
        else {
          for (var i = 0; i < args['filtre'].length; ++i) {
            result.push(value[args['filtre'][i]]);
          }
        }
      }
    }
    else result = value;
    return result;
  }
}
