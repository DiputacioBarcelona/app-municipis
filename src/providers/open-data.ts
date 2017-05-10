import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

@Injectable()
export class OpenData {
  municipisInfo: any[] = [];
  // indexMunicipis: { [ine: string]: number} = { };
  puntsInfo: any[] = [];
  temes: string[] = [];

  /* This is the base url of the open data's API  */
  private baseUrl: string = 'http://do.diba.cat/api/';
  /* This token is used to collect statistics for this app on the API calls */
  private token: string = '6b628524631aa27df30d122024f32dd8';


  constructor(
    private http: Http, 
    private loadingCtrl: LoadingController, 
    private storage2: Storage
  ) {}

  /*  Retorna si un objecte es Iterable, retorna fals amb strings */
  private isIterable(obj) {
    if (obj == undefined) {
      return false;
    }
    let keys = Object.keys(obj);
    // Comprovem que l'objecte conté indexos i son diferents de 0
    // ja que els strings s'indexen numericament
    return keys.length != 0 && keys[0] != '0';
  };

  /*  Retorna la última data de modificació d'un dataset a la API
      Return d'enllaç: Promise
      Retorn de dades: Promise(resultat -> String) / resultat pot ser: { <data> | undefined } */
  // private getUpdateDateAPI(datasetName: string, token: string) {
  //   return new Promise((resolve) => {
  //     this.http.get(this.baseUrl + 'info/datasets/dataset/' + datasetName + '/token/' + token)
  //     .timeout(5000)
  //     .map(res => res.json()['modificacio'])
  //     .subscribe(data => { resolve(data) }, err => { resolve(undefined) });
  //   }).catch((err) => { console.log('getUpdateDateAPI - Error: ' + err); return undefined; });
  // }

  /*  Retorna la informació d'un dataset <nomDataset> de la API
      Return d'enllaç: Promise
      Return de dades: Promise(resultat -> array) */
  private getDatasetAPIContent(datasetName: string, camp_ord: string) {
    let url : string  = this.baseUrl + 'dataset/' + datasetName + '/format/JSON/ord-' + camp_ord + '/token/' + this.token;
    console.log('getDatasetAPIContent - URL: ' + url);
    return new Promise((resolve) => {  
      this.http.get(url)
      .timeout(5000)
      .map(res => res.json()['elements'])
      .subscribe(data => { resolve(data) });
    }).catch((err) => { console.error('getDatasetAPIContent - URL: '+ url + ' - Error: ' + err); });
  };

  /*  Retorna l'informació d'un contentType <contentType>, pel municipi <ine> especificat */
  // private getContentTypeContent(contentTypeName: string, ine: string) {
  //   return new Promise((resolve) => {
  //     this.http.get(this.baseUrl + 'tipus/' + contentTypeName + '/camp-rel_municipis/' + ine + '/token/' + this.token)
  //     .timeout(5000)
  //     .map((data) => data.json().datasets)
  //     .subscribe((data) => { resolve(data) });
  //   })
  //   .catch((err) => { console.error('getContentTypeContent - Error: ' + err); });
  // }

  /*  Formateja el contingut provinent de la API perque tingui una estructura més simple dins la app */
  private contentFormat (APIContent: any) {
    return Promise.resolve().then(() => {
      if(APIContent[0] == undefined) {
        return [];
      }
      let indexsAPI = Object.keys(APIContent[0]); // Index dels fields de la API, alguns son arrays
      let dataset = [];
      interface fields {[ind: string]: string};

      for (var i = 0; i < APIContent.length; ++i) {
        let element = {} as fields;
        for (var j = 0; j < indexsAPI.length; ++j) {
          let index = indexsAPI[j];
          let subIndex: string[] = [];

          if (this.isIterable(APIContent[i][index])) {
            subIndex = Object.keys(APIContent[i][index]);
          } else { 
            subIndex.push('empty');
          }

          for (var z = 0; z < subIndex.length; ++z) {
            let subSubIndex: string[] = [];
            if (subIndex[0] == 'empty') {
              element[index] = APIContent[i][index];
            } else {
              if (this.isIterable(APIContent[i][index][subIndex[z]])) {
                subSubIndex = Object.keys(APIContent[i][index][subIndex[z]]);
              } else {
                subSubIndex.push('empty');
              }
            }

            for (var w = 0; w < subSubIndex.length; ++w) {
              if (subSubIndex[0] == 'empty') {
                element[subIndex[z]] = APIContent[i][index][subIndex[z]];
              } else {
                element[subSubIndex[w]] = APIContent[i][index][subIndex[z]][subSubIndex[w]];
              }
            }
          }
        }
        element['favourite'] = 'false';
        dataset.push(element);
      }
      return dataset;
    }).catch((err) => { console.error('contentFormat - Error: ' + err['message']) });
  };

    /*  tslint:enable */
  /*************************************** UTILS END ************************************************/

  /********************************* CRIDES APP +MUNICIPIS ******************************************/

  /*  Carrega desde la API de dades Obertes el dataset Municipis amb els elements ordenats per municipi transliterat */
  loadMunicipis(loading: any) {
    return Promise.resolve().then(() => {
      return this.getDatasetAPIContent('municipis', 'municipi_transliterat');
    }).then((contingutAPI) => {
      return this.contentFormat(contingutAPI);
    }).then((contingutFormatejat: any) => {
      this.municipisInfo = contingutFormatejat;
          return loading.dismiss();
    }).catch((err) => { console.error('loadMunicipis - Error: ' + err['message']) });
  };

  // /*  Caniva l'estat "favourite" d'un municipi  */
  // public toggleFavourite(ine: string) {
  //   // var pref = this.municipisInfo[this.indexMunicipis[ine]]['favourite'];
  //   // if (pref == true) {
  //   //   pref = this.municipisInfo[this.indexMunicipis[ine]]['favourite'] = false;
  //   // }
  //   // else {
  //   //   pref = this.municipisInfo[this.indexMunicipis[ine]]['favourite'] = true;
  //   // }
  //   // return this.storage.executeSql("UPDATE municipis SET favourite = '" + String(pref) + "' WHERE ine = '" + ine + "'",[])
  //   // .catch((err) => { console.error('ERROR - toggleFavourite: ' + err['message']) });
  // }

  /*  Consulta el <searchValue> a la API i retorna les claus dels municipis dins el vector municipisInfo */
  // public reduceFiltering(arrayIndexsFiltering: number[], searchValue : any) {
  //   let munFil : any;
  //   let comFil : any;
  //   return new Promise(resolve => {
  //     this.http.get(this.baseUrl + 'dataset/municipis/format/JSON/ord-municipi_transliterat/camp-municipi_nom-like/' + searchValue + '/token/' + this.token)
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       resolve(data);
  //     });
  //     err => console.error(err)
  //   }).then((municipis) => {
  //     munFil = municipis;
  //     return new Promise(resolve => {
  //       this.http.get(this.baseUrl + 'dataset/municipis/format/JSON/ord-municipi_transliterat/camp-comarca_nom-like/' + searchValue + '/token/' + this.token)
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         resolve(data);
  //       });
  //       err => console.error(err)
  //     })
  //   }).then((comarques) => {
  //     comFil = comarques;
  //     arrayIndexsFiltering = [];
  //     for (var i = 0; i < munFil['entitats']; i++) {
  //       arrayIndexsFiltering.push(this.indexMunicipis[munFil['elements'][i]['ine']]);
  //     }
  //     for (var i = 0; i < comFil['entitats']; i++) {
  //       arrayIndexsFiltering.push(this.indexMunicipis[comFil['elements'][i]['ine']]);
  //     }
  //     arrayIndexsFiltering = arrayIndexsFiltering.filter(function(elem, index, self) {
  //       return index == self.indexOf(elem);
  //     });
  //     return arrayIndexsFiltering;
  //   });
  // }
}
