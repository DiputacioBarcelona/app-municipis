import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'
//TODO: REMOVE console.log
@Injectable()
export class OpenData {
  private dataMunicipi: any;
  private DATA_LOADED_MUNICIPIS = 'hasLoadedMuncipis';
  private dateLoadedMunicipis;
  private DATE_LOADED_MUNICIPIS = 'dateLoadedMunicipis';

  /* This is the base url of the open data's API  */
  private BASEURL = 'http://do.diba.cat/api/';
  /* This token is used to collect statistics for this app on the API calls */
  private TOKEN = '6b628524631aa27df30d122024f32dd8';

  constructor(
    private http: Http,
    private storage: Storage
  ) {}

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
      .map(res => res.json()['elements'])
      .timeout(5000);

    return elements;    
  }

  // private loadMunicipisFromStorage(): any {
  //   console.log('LOAD_MUNICIPIS_STORAGE');

  //   this.storage.get(this.DATA_LOADED_MUNICIPIS).then((value) => {
  //     return value;
  //   });
  // }

  getMunicipis() {
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
        this.storage.set(this.DATE_LOADED_MUNICIPIS, new Date());
        // console.log('----------- DATE_LOADED_MUNICIPIS: ' + this.storage.get(this.DATE_LOADED_MUNICIPIS).toLocaleString());
        this.storage.set(this.DATA_LOADED_MUNICIPIS, this.dataMunicipi);
        return this.dataMunicipi;
      });
    }

  }

}
