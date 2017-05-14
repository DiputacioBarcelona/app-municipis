import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

import { UserData } from './user-data';

//TODO: REMOVE console.log
@Injectable()
export class OpenData {
  private dataMunicipi: any;
  // private DATA_LOADED_MUNICIPIS = 'dataLoadedMunicipis';
  // private DATE_LOADED_MUNICIPIS = 'dateLoadedMunicipis';
  // private DATE_API_UPDATE_MUNICIPIS = 'dateAPIUpdateMunicipis';

  /* This is the base url of the open data's API  */
  private BASEURL = 'http://do.diba.cat/api/';
  /* This token is used to collect statistics for this app on the API calls */
  private TOKEN = '6b628524631aa27df30d122024f32dd8';

  constructor(
    private http: Http,
    private storage: Storage,
    public userData: UserData
  ) {}

  // FIXME: don't use this URL, instead use this one:
  // http://do.diba.cat/api/dataset/municipis/format/JSON/ord-municipi_transliterat/token/6b628524631aa27df30d122024f32dd8/pag-ini/0/pag-fi/1
  // private getUpdateDateAPI(datasetName: string) {
  //   let url : string  = this.BASEURL + 'info/datasets/dataset/' + datasetName + '/token/' + this.TOKEN;
  //   console.log('URL: ' + url);

  //    let jsonObject = this.http.get(url)
  //     .map(res => res.json()['modificacio'])
  //     .timeout(5000);

  //   return jsonObject
  // }

  private getDatasetAPIContent(datasetName: string, camp_ord: string): any {  
    let url : string  = this.BASEURL + 'dataset/' + datasetName + '/format/JSON/ord-' + camp_ord + '/token/' + this.TOKEN;
    console.log('URL: ' + url);
    
    let elements = this.http.get(url)
      .map(res => res.json())
      .timeout(5000);

    return elements;    
  }

  // private loadMunicipisFromStorage(): any {
  //   console.log('LOAD_MUNICIPIS_STORAGE');

  //   this.storage.get(this.DATA_LOADED_MUNICIPIS).then((value) => {
  //     return value;
  //   });
  // }

  private loadMunicipis(): any {
    // console.log('GET_MUNICIPIS');

    // this.getUpdateDateAPI('municipis').subscribe((data: any) => {
    //   console.log('----------- .subscribe: ' + data);			
    // });
     
    if (this.dataMunicipi) {
      console.log('Observable');
      return Observable.of(this.dataMunicipi);
    } else {
      return this.getDatasetAPIContent('municipis', 'municipi_transliterat').map((data: any)=>{
        this.dataMunicipi = data;
        // this.storage.set(this.DATE_LOADED_MUNICIPIS, new Date());
        // this.storage.set(this.DATA_LOADED_MUNICIPIS, this.dataMunicipi);
        // this.storage.set(this.DATE_API_UPDATE_MUNICIPIS, new Date(this.dataMunicipi.modificacio));        
        return this.dataMunicipi;
      });
    }
  }

  getMunicipis(queryText = '', segment = 'all') {
     return this.loadMunicipis().map((jsonObject: any) => {
      let data = jsonObject;
      data.shownData = 0;

      // queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      // let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      data.elements.forEach((municipi: any) => {
      // check if this municipi should show or not
      this.filterMunicipis(municipi, queryText, segment);
          if (!municipi.hide) {
            data.shownData++;
          }
      });
      return data;
    });
  }

  private filterMunicipis(municipi: any, queryText: string, segment: string) {

    let matchesQueryText = false;
    // if (queryWords.length) {
      // of any query word is in the municipi name than it passes the query test
      // queryWords.forEach((queryWord: string) => {
        if (municipi.municipi_transliterat.indexOf(this.transliterate(queryText)) > -1) {
          matchesQueryText = true;
        // }
      // });
    } else {
      // if there are no query words then this municipi passes the query test
      matchesQueryText = true;
    }

    // if the segement is 'favorites', but municipi is not a user favorite
    // then this municipi does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.userData.hasFavorite(municipi.ine)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    municipi.hide = !(matchesQueryText && matchesSegment);
  }

  private transliterate(text: string ) : string {
    // sanitize
    // Transliterem segons les normes del català
    // Eliminem tot el que no sigui text
    text = text.replace("/[^A-Za-z0-9 ]/", '');
    // Separador dels espais
    text = text.replace(' ', '_');
    // Torna-ho tot en minúscules
    text = text.toLowerCase();

    return text;
  }
  // /**
  // * Transliteració de cadenes de text
  // */
  // public static function transliterate($text, $separador = '_', $charset = '') {
  //     $text = self::sanitizeString($text, $charset);
  //     // Transliterem segons les normes del català
  //     setlocale(LC_CTYPE, 'ca_ES.utf8');
  //     $text = iconv('UTF-8', 'ASCII//TRANSLIT', $text);
  //     // Eliminem tot el que no sigui text
  //     $text = preg_replace("/[^A-Za-z0-9 ]/", '', $text);
  //     // Separador dels espais.
  //     $text = str_replace(' ', $separador, $text);
  //     // Torna-ho tot en minúscules
  //     $text = mb_strtolower($text);
  //     return filter_var($text, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
  // }

}
