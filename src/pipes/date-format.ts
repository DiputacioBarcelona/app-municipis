import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})

//TODO: use the DatePipe
export class DateFormat implements PipeTransform {

    transform(value:any, arg1:any):any {
        let retValue = '';

        let date_ini: Date = new Date(value);
        let date_fi: Date = new Date(arg1);
        /*console.log('Data ini: '+ date_ini.toLocaleString());
        console.log('Data fi: '+ date_fi.toLocaleString());
        console.log('getDay: '+ date_ini.getDay);
        console.log('getHours: '+ date_ini.getHours);
        console.log('getSecords: '+ date_ini.getSeconds);*/
        
        retValue = date_ini.toLocaleString() + ' - ' + date_fi.toLocaleString();

        return retValue;
        
    }
}
