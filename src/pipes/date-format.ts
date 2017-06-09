import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})

//TODO: format dates
export class DateFormat implements PipeTransform {

    transform(value:any, arg1:any):any {
        let retValue = '';

        let date_ini: Date = new Date(value);
        let date_fi: Date = new Date(arg1);
        
        retValue = date_ini.toLocaleString() + ' - ' + date_fi.toLocaleString();

        return retValue;
        
    }
}
