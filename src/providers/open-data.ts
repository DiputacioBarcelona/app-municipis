import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

@Injectable()
export class OpenData {
  //TODO:
  // puntsInfo: any;
  // temes: string;

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
    // if (this.municipisInfo) {
    //   console.log('Observable');
    //   return Observable.of(this.municipisInfo);
    // } else {     
      let url : string  = this.baseUrl + 'dataset/' + 'municipis' + '/format/JSON/ord-' + 'municipi_transliterat' + '/token/' + this.token;
       console.log('URL: ' + url);
      return this.http.get(url)
        .map(res => res.json()['elements']);
    // }
  }

  // processMunicipis(municipisInfo: any) {
  //   // just some good 'ol JS fun with objects and arrays
  //   // build up the data by linking speakers to sessions
  //   this.municipisInfo = municipisInfo.json();

  //   // this.data.tracks = [];

  //   // // loop through each day in the schedule
  //   // this.data.schedule.forEach((day: any) => {
  //   //   // loop through each timeline group in the day
  //   //   day.groups.forEach((group: any) => {
  //   //     // loop through each session in the timeline group
  //   //     group.sessions.forEach((session: any) => {
  //   //       session.speakers = [];
  //   //       if (session.speakerNames) {
  //   //         session.speakerNames.forEach((speakerName: any) => {
  //   //           let speaker = this.data.speakers.find((s: any) => s.name === speakerName);
  //   //           if (speaker) {
  //   //             session.speakers.push(speaker);
  //   //             speaker.sessions = speaker.sessions || [];
  //   //             speaker.sessions.push(session);
  //   //           }
  //   //         });
  //   //       }

  //   //       if (session.tracks) {
  //   //         session.tracks.forEach((track: any) => {
  //   //           if (this.data.tracks.indexOf(track) < 0) {
  //   //             this.data.tracks.push(track);
  //   //           }
  //   //         });
  //   //       }
  //   //     });
  //   //   });
  //   // });

  //   return this.municipisInfo;
  // }

  getMunicipis(queryText = '', segment = 'all') {
    return this.loadMunicipis().map((data: any) => {
      let day = data;
      // let day = data.schedule[dayIndex];
      // day.shownSessions = 0;

      // queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      // let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

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

      return day;
    });
  }

}
