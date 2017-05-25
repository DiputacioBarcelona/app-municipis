import { Pipe, PipeTransform } from '@angular/core';
/*import { DatePipe } from '@angular/common';*/

@Pipe({
  name: 'dateFormat'
})

//TODO: use the DatePipe
export class DateFormat implements PipeTransform {

/*    constructor(
      private datePipe: DatePipe
    ) {}*/

    transform(value:any, args:string[]):any {
        if (value) {
            /*var date = value instanceof Date ? value : new Date(value);
            return this.datePipe.transform(date, 'dd/MM/yyyy');*/
            return value.substring(0,10);
        }
    }
}
