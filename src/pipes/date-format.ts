import 'intl';
import 'intl/locale-data/jsonp/en';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})

//TODO: use the DatePipe
export class DateFormat implements PipeTransform {

    transform(value:any, args:string[]):any {
        if (value) {
            return value.substring(0,10);
            /*if(Intl) {
                let options: Intl.DateTimeFormatOptions = {
                    day: "numeric", month: "numeric", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                };
                console.log('----------------------');
                var date = value instanceof Date ? value : new Date(value);
                console.log(new Intl.DateTimeFormat().format(date));
                return new Intl.DateTimeFormat().format(date) + ' ' + new Intl.DateTimeFormat(navigator.language, {hour:'numeric',minute:'2-digit'}).format(date);
            } else {
                return value.toString();
            }*/
        }
    }
}
