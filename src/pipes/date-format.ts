import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})

//TODO: use the DatePipe
export class DateFormat implements PipeTransform {

    transform(value:any, arg1:any):any {
        console.log('Data ini: '+ value);
        console.log('Data fi: '+ arg1);
        
        return value.substring(0,10);
        
    }
}
