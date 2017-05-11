import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

@Injectable()
export class OpenData {
  //TODO: puntsInfo, temes
  // puntsInfo: any;
  // temes: string;
  dataMunicipi: any;

  /* This is the base url of the open data's API  */
  private baseUrl: string = 'http://do.diba.cat/api/';
  /* This token is used to collect statistics for this app on the API calls */
  private token: string = '6b628524631aa27df30d122024f32dd8';


  constructor(
    private http: Http,
    private storage: Storage
  ) {}


  /*  Retorna la informació d'un dataset <nomDataset> de la API
      Return d'enllaç: Promise
      Return de dades: Promise(resultat -> array) */
  // private getDatasetAPIContent(datasetName: string, camp_ord: string) {
  //   let url : string  = this.baseUrl + 'dataset/' + datasetName + '/format/JSON/ord-' + camp_ord + '/token/' + this.token;
  //   console.log('getDatasetAPIContent - URL: ' + url);
  //   return new Promise((resolve) => {  
  //     this.http.get(url)
  //     .timeout(5000)
  //     .map(res => res.json()['elements'])
  //     .subscribe(data => { resolve(data) });
  //   }).catch((err) => { console.error('getDatasetAPIContent - URL: '+ url + ' - Error: ' + err); });
  // }

  loadMunicipis(): any {    
    if (this.dataMunicipi) {
      console.log('Observable');
      return Observable.of(this.dataMunicipi);
    } else {     
      let url : string  = this.baseUrl + 'dataset/' + 'municipis' + '/format/JSON/ord-' + 'municipi_transliterat' + '/token/' + this.token;
       console.log('URL: ' + url);
      return this.http.get(url)
        .map(res => res.json()['elements']);
    }
  }

  getMunicipis(queryText = '', segment = 'all') {
    return this.loadMunicipis().map((data: any) => {
      this.dataMunicipi = data;
      // let day = data;
      // let day = data.schedule[dayIndex];
      // day.shownSessions = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      // day.groups.forEach((group: any) => {
      //   group.hide = true;

      //   group.sessions.forEach((session: any) => {
      //     // check if this session should show or not
      //     this.filterSession(session, queryWords, excludeTracks, segment);

      //     if (!session.hide) {
      //       // if this session is not hidden then this group should show
      //       group.hide = false;
      //       day.shownSessions++;
      //     }
      //   });

      // });

      // return day;
      return this.dataMunicipi;
    });
  }

}
