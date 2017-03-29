import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController} from 'ionic-angular';
import { SQLite } from 'ionic-native';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

@Injectable()
export class OpenData {
	public municipisInfo : any = [];
  public indexMunicipis: { [ine: string]: number} = { };
  public puntsInfo : any = [];
  public temes : string[] = [];
  private storage: SQLite;
  private isOpen: boolean;


  constructor(public http: Http, private loadingCtrl: LoadingController) {}

  /*************************************** BD MANAGEMENT ************************************************/
    /*  tslint:disable */

    /*  Genera l'accés a la BD, si ja està obert retorna
        Return d'enllaç: Promise
        Retorn de dades: Promise */
    private openBD() {
      if(!this.isOpen) {
        return Promise.resolve().then(() => {
          this.storage = new SQLite();
          this.isOpen = true;
          return this.storage.openDatabase({ name: 'mesmunicipis.db', location: 'default' });
        }).catch((err) => {
          console.error('ERROR - openBD1: ' + err['message']);
          this.isOpen = false;
        });
      } else {
        return Promise.resolve()
        .catch((err) => { console.error('ERROR - openBD2: ' + err['message'])} );
      }
    }

    /*  Comprova si existeix la taula <nomTaula> a la BD
        Return d'enllaç: Promise
        Retorn de dades: Boolean */
    private existsTable(tableName: string) {
      return Promise.resolve().then(() => {
        return this.openBD();
      }).then(() => {
        return this.storage.executeSql("SELECT * FROM sqlite_master WHERE type='table'", []);
      }).then((res : any) => {
        if(res.rows.length > 0) {
          for(let i = 0; i < res.rows.length; i++) {
            if (res.rows.item(i).tbl_name == tableName) return true;
          }
        }
        return false;
      }).catch((err) => { console.error('ERROR - existsTable: ' + err['message']) });
    }

    /*  Crea la taula <nomTaula> a la BD si no existeix, amb els titols de les columnes <titolsCol> i el seu <contingut>
        Return d'enllaç: Promise
        Retorn de dades: Promise */
    private createTable(tableName: string, columnsNames: any[]) {
      return Promise.resolve().then(() => {
        return this.openBD();
      }).then(() => {
        let aux : string[] = [];
        for (var i = 0; i < columnsNames.length; ++i) {
          aux[i] = columnsNames[i] + ' TEXT';
          if (i == 0) aux[i] += ' PRIMARY KEY';
        }
        let titols = aux.join(',');
        return this.storage.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + titols + ')', []);
      }).catch((err) => { console.error('ERROR: - createTable: ' + err['message']) });
    }

    /*  Retorna el contingut de la taula <nomTaula> si existeix, si no retorna buit
        Return d'enllaç: Promise
        Retorn de dades: Promise(resultat -> Array) */
    private getTableContent(tableName: string) {
      return Promise.resolve().then(() => {
        return this.openBD();
      }).then(() => {
        return this.existsTable(tableName);
      }).then((existeix) => {
        if (!existeix) return '';
        else return this.storage.executeSql('SELECT * FROM ' + tableName, []);
      }).catch((err) => { console.error('ERROR - getTableContent: ' + err['message']) });
    }

    /*  Inserta o fa replace del contingut <contingut> a la taula <nomTaula> a través de la primera
        columna (ID) de <titolsCol> */
    private setTableContent(tableName: string, columnsNames: any[], values: any[]) {
      return Promise.resolve().then(() => {
        return this.openBD();
      }).then(() => {
        return this.existsTable(tableName);
      }).then((existeixTaula) => {
        if (existeixTaula && columnsNames.length > 0 && values.length > 0){
          let aux: any[] = values;
          for (var i = 0; i < values.length; ++i) {
            for (var j = 0; j < values[i].length; ++j) {
              aux[i][j] = "'" + values[i][j] + "'";
            }
            aux[i] = '(' + values[i].join(',') + ')';
          }
          let titols = columnsNames.join(',');
          let valors = aux.join(',');
          return this.storage.executeSql(
            'INSERT OR REPLACE INTO ' + tableName + ' (' + titols + ') ' + 'VALUES ' + valors,
            []
          )
        }
      }).catch((err) => { console.error('ERROR - setTableContent: ' + err['message']) });
    }

    /*  Retorna el titols de les columnes de la taula <nomTaula> */
    private getColumnsNames(tableName: string) {
      return Promise.resolve().then(() => {
        return this.openBD();
      }).then(() => {
        return this.storage.executeSql('PRAGMA table_info('+tableName+')',[]);
      }).catch((err) => { console.error('ERROR - getColumnsNames: ' + err['message']) });
    }

    /*  Retorna el valor del camp <camp> de la taula <nomTaula> amb identificador <id> */
    private getValueByID(tableName: string, id: string, column: string) {
      var columnaID;
      return Promise.resolve().then(() => {
        return this.openBD();
      }).then(() => {
        return this.existsTable(tableName);
      }).then((existeix) => {
        if (existeix) return this.getColumnsNames(tableName);
        else return;
      }).then((titols : any) => {
        if (titols.rows.item(0).name) {
          columnaID = titols.rows.item(0).name;
          return this.storage.executeSql('SELECT ' + column + ' FROM ' + tableName + ' WHERE ' + columnaID + "='" + id + "'",[]);
        }
        else return;
      }).then((resultat: any) => {
        if (resultat) return resultat.rows.item(0)[column];
        else return '';
      }).catch((err) => { console.error('ERROR - getValueByID: ' + err['message']) });
    }

    /*  Retorna el nombre d'elements d'un dataset de la BD  */
    private numElements(tableName: string) {
      return Promise.resolve().then(() => {
        return this.openBD();
      }).then(() => {
        return this.storage.executeSql('SELECT count(*) FROM ' + tableName, []);
      }).then((resultat: any) => {
        if (resultat) return resultat.rows.item(0)['count(*)'];
        else return '';
      }).catch((err) => { console.error('ERROR - numElements: ' + err['message']) });
    }

    /*  Esborra la taula <nomTaula> de la BD interna si existeix
        Return d'enllaç: Promise
        Retorn de dades: Promise(Void) */
    private deleteTable(tableName: string) {
      return Promise.resolve().then(() => {
        return this.openBD();
      }).then(() => {
        return this.storage.executeSql('DROP TABLE IF EXISTS ' + tableName, [])
      }).catch((err) => { console.error('ERROR - deleteTable: ' + err['message']) });
    }

    /*  tslint:enable */
  /************************************* BD MANAGEMENT END **********************************************/

  /***************************************** UTILS **************************************************/
    /*  tslint:disable */

    /*  Retorna si un objecte es Iterable, retorna fals amb strings */
    private isIterable(obj) {
      if (obj == undefined) return false;
      let keys = Object.keys(obj);
      // Comprovem que l'objecte conté indexos i son diferents de 0
      // ja que els strings s'indexen numericament
      return keys.length != 0 && keys[0] != '0';
    }

    /*  Retorna la última data de modificació d'un dataset a la API
        Return d'enllaç: Promise
        Retorn de dades: Promise(resultat -> String) / resultat pot ser: { <data> | undefined } */
    private getUpdateDateAPI(datasetName: string, token: string) {
      return new Promise((resolve) => {
        this.http.get('http://do.diba.cat/api/info/datasets/dataset/' + datasetName + '/token/' + token)
        .timeout(5000)
        .map(res => res.json()['modificacio'])
        .subscribe(data => { resolve(data) }, err => { resolve(undefined) });
      }).catch((err) => { console.log('getUpdateDateAPI - Error: ' + err); return undefined; });
    }

    /*  Retorna la informació d'un dataset <nomDataset> de la API
        Return d'enllaç: Promise
        Return de dades: Promise(resultat -> array) */
    private getDataSetAPIContent(datasetName: string, token: string, camp_ord: string) {
      return new Promise((resolve) => {
        this.http.get('http://do.diba.cat/api/dataset/' + datasetName + '/format/JSON/ord-' + camp_ord + '/token/' + token)
        .timeout(5000)
        .map(res => res.json()['elements'])
        .subscribe(data => { resolve(data) });
      })
      .catch((err) => { console.error('getDataSetAPIContent - Error: ' + err); });
    }

    /*  Retorna l'informació d'un contentType <contentType>, pel municipi <ine> especificat */
    private getContentTypeContent(contentTypeName: string, ine: string) {
      return new Promise((resolve) => {
        this.http.get('http://do.diba.cat/api/tipus/' + contentTypeName + '/camp-rel_municipis/' + ine)
        .timeout(5000)
        .map((data) => data.json().datasets)
        .subscribe((data) => { resolve(data) });
      })
      .catch((err) => { console.error('getContentTypeContent - Error: ' + err); });
    }

    /*  Converteix el resultat (elements[]) d'una crida a la API formatejada en JSON a una taula (matriu)
        Return d'enllaç: Promise
        Return de dades: Promise(resultat -> array) */
    private APIData2SqlData(APIData: any) {
      return Promise.resolve()
      .then(() => {
        let indexsAPI = Object.keys(APIData[0]); // Index dels camps de la API, alguns son arrays
        let colTitles = []; // Titols de les columnes de la futura taula
        let content = []; // Contingut dels camps de la futura taula

        for (var i = 0; i < indexsAPI.length; ++i) {
          let indexs: string[] = [];

          // Si es iterable agafem els subindexs com a index
          // No cal mantenir una sincronia absoluta amb l'estructura de la API, la comunicació sera d'un sol sentit (API -> BD)
          if (this.isIterable(APIData[0][indexsAPI[i]])) indexs = Object.keys(APIData[0][indexsAPI[i]]);
          else indexs.push(indexsAPI[i]);

          for (var j = 0; j < indexs.length; ++j) {
            colTitles.push(indexs[j]);
          }
        }

        for (var i = 0; i < APIData.length; ++i) {
          let camp = [];
          for (var j = 0; j < indexsAPI.length; ++j) {
            let index = indexsAPI[j];
            let subIndex: string[] = [];

            if (this.isIterable(APIData[i][indexsAPI[j]])) subIndex = Object.keys(APIData[i][indexsAPI[j]]);
            else subIndex.push('empty');

            for (var z = 0; z < subIndex.length; ++z) {
              let contingutCamp;
              if (subIndex[0] == 'empty') contingutCamp = APIData[i][index];
              else contingutCamp = APIData[i][index][subIndex[z]];
              // Per no generar problemes en l'inserció a la BD
              contingutCamp = contingutCamp.replace(/,/g,';');
              contingutCamp = contingutCamp.replace(/'/g,'¿');
              camp.push("'" + contingutCamp + "'");
            }
          }
          content.push(camp);
        }
        return [colTitles,content];
      })
      .catch((err) => { console.error('APIData2SqlData - Error: ' + err['message']) });
    }

    /*  Formateja el contingut provinent de la API perque tingui una estructura més simple dins la app */
    private contentFormat (APIContent: any) {
      return Promise.resolve().then(() => {
        if(APIContent[0] == undefined) return [];
        let indexsAPI = Object.keys(APIContent[0]); // Index dels camps de la API, alguns son arrays
        let dataset = [];
        interface camps {[ind: string]: string};

        for (var i = 0; i < APIContent.length; ++i) {
          let element = {} as camps;
          for (var j = 0; j < indexsAPI.length; ++j) {
            let index = indexsAPI[j];
            let subIndex: string[] = [];

            if (this.isIterable(APIContent[i][index])) subIndex = Object.keys(APIContent[i][index]);
            else subIndex.push('empty');

            for (var z = 0; z < subIndex.length; ++z) {
              let subSubIndex: string[] = [];
              if (subIndex[0] == 'empty') element[index] = APIContent[i][index];
              else if (this.isIterable(APIContent[i][index][subIndex[z]])) subSubIndex = Object.keys(APIContent[i][index][subIndex[z]]);
              else subSubIndex.push('empty');

              for (var w = 0; w < subSubIndex.length; ++w) {
                if (subSubIndex[0] == 'empty') element[subIndex[z]] = APIContent[i][index][subIndex[z]];
                else element[subSubIndex[w]] = APIContent[i][index][subIndex[z]][subSubIndex[w]];
              }
            }
          }
          element['favourite'] = 'false';
          dataset.push(element);
        }
        return dataset;
      }).catch((err) => { console.error('ERROR - contentFormat: ' + err['message']) });
    }

    /*  tslint:enable */
  /*************************************** UTILS END ************************************************/

  /********************************* CRIDES APP +MUNICIPIS ******************************************/
    /*  Caniva l'estat "favourite" d'un municipi  */
    public toggleFavourite(ine: string) {
      var pref = this.municipisInfo[this.indexMunicipis[ine]]['favourite'];
      if (pref == true) pref = this.municipisInfo[this.indexMunicipis[ine]]['favourite'] = false;
      else pref = this.municipisInfo[this.indexMunicipis[ine]]['favourite'] = true;
      return this.storage.executeSql("UPDATE municipis SET favourite='" + String(pref) + "' WHERE ine ='" + ine + "'",[])
      .catch((err) => { console.error('ERROR - toggleFavourite: ' + err['message']) });
    }

    /*  Carrega desde la API de dades Obertes el dataset Municipis amb els elements ordenats per municipi transliterat */
    public loadMunicipis(loading: any) {
      return Promise.resolve().then(() => {
        return this.getDataSetAPIContent('municipis','','municipi_transliterat');
      }).then((contingutAPI) => {
        return this.contentFormat(contingutAPI);
      }).then((contingutFormatejat: any) => {
        return this.existsTable('municipis').then((exists) => {
          if (!exists) {
            return this.createTable('municipis',['ine','municipi_transliterat','favourite']).then(() => {
              let elements = [];
              for (var i = 0; i < contingutFormatejat.length; ++i) {
                elements.push([contingutFormatejat[i]['ine'],contingutFormatejat[i]['municipi_transliterat'],'false']);
              }
              return this.setTableContent('municipis',['ine','municipi_transliterat','favourite'],elements);
            })
          }
        }).then(() => {
          return this.getTableContent('municipis').then((contingut) => {
            for (var i = 0; i < contingut.rows.length; ++i) {
              this.indexMunicipis[contingut.rows.item(i)['ine']] = i;
              if(contingut.rows.item(i)['favourite'] == 'true') contingutFormatejat[i]['favourite'] = true;
              else contingutFormatejat[i]['favourite'] = false;
            }
            this.municipisInfo = contingutFormatejat;
            return loading.dismiss();
          })
        })
      }).catch((err) => { console.error('ERROR - loadMunicipis: ' + err['message']) });
    }

    /*  Consulta el <searchValue> a la API i retorna les claus dels municipis dins el vector municipisInfo */
    public reduceFiltering(arrayIndexsFiltering: number[], searchValue : any) {
      let munFil : any;
      let comFil : any;
      return new Promise(resolve => {
        this.http.get('http://do.diba.cat/api/dataset/municipis/format/JSON/ord-municipi_transliterat/camp-municipi_nom-like/'+searchValue)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
        err => console.error(err)
      }).then((municipis) => {
        munFil = municipis;
        return new Promise(resolve => {
          this.http.get('http://do.diba.cat/api/dataset/municipis/format/JSON/ord-municipi_transliterat/camp-comarca_nom-like/'+searchValue)
          .map(res => res.json())
          .subscribe(data => {
            resolve(data);
          });
          err => console.error(err)
        })
      }).then((comarques) => {
        comFil = comarques;
        arrayIndexsFiltering = [];
        for (var i = 0; i < munFil['entitats']; i++) {
          arrayIndexsFiltering.push(this.indexMunicipis[munFil['elements'][i]['ine']]);
        }
        for (var i = 0; i < comFil['entitats']; i++) {
          arrayIndexsFiltering.push(this.indexMunicipis[comFil['elements'][i]['ine']]);
        }
        arrayIndexsFiltering = arrayIndexsFiltering.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
        });
        return arrayIndexsFiltering;
      });
    }

    /*  Carrega desde la API de dades Obertes el contentType punts amb els elements filtrats pel municipi
    public carregaPunts(ine: string) {
      return this.getContentTypeContingut('punt',ine).then((contingut: any) => {
        var promises = [];
        for (var i = 0; i < contingut.length; ++i) {
          promises.push(this.formatejaContingut(contingut[i]['elements']));
        }
        return Promise.all(promises);
      }).then((resultats : any) => {
        console.log(JSON.stringify(resultats));
        for (var i = 0; i < resultats.length; ++i) {
          this.puntsInfo.push(resultats[i]);
        }
        return;
      }).then(()=> {
        return this.getDataSetAPIContingut('temes','','');
      }).then((temesContingut: any) => {
        for (var i = 0; i < temesContingut.length; ++i) {
          this.temes.push(temesContingut[i]['tema_nom']);
        }
        return;
      }).catch((err) => { console.error('ERROR - carregaPunts: ' + err['message']) });
    }
    */


  /******************************* CRIDES APP +MUNICIPIS END ****************************************/

  /************************************ DEBUGGING TOOLS *********************************************/
    /*  tslint:disable */

    /*  Obté el contingut de la taula <nomTaula> i el mostra per consola amb <numFil> especificat
        Return d'enllaç: Promise
        Retorn de dades: Void (printa per consola) */
    // private printInfoTable(tableName: string, numFil: number) {
    //   return Promise.resolve().then(() => {
    //     return this.openBD()
    //   }).then(() => {
    //     return this.existsTable(tableName);
    //   }).then((existeixTaula : any) => {
    //     if (existeixTaula) return this.storage.executeSql('SELECT * FROM ' + tableName + ' ORDER BY ROWID', []);
    //     else return '';
    //   }).then((data : any) => {
    //     if (data) {
    //       if (numFil > data.rows.length) numFil = data.rows.length;
    //       console.log('----------------------------------------------------------');
    //       console.log(
    //         'Informacio de la taula: ' + tableName + '                       ' +
    //         ' Mostrant ' + numFil + ' de ' + data.rows.length + ' files.'
    //         );
    //       console.log('----------------------------------------------------------');
    //       if(data.rows.length > 0) {
    //         for(let i = 0; i < numFil; i++) {
    //           console.log(i+1 + ': ' + JSON.stringify(data.rows.item(i)));
    //         }
    //       }
    //       else {
    //         console.log('La taula és buida');
    //       }
    //       console.log('----------------------------------------------------------');
    //       return;
    //     }
    //     else {
    //       console.log('----------------------------------------------------------');
    //       console.log('La taula ' + tableName + ' no existeix.');
    //       console.log('----------------------------------------------------------');
    //     }
    //   }).catch((err) => { console.error('ERROR - printInfoTable: ' + err['message']) });
    // }

    /*  Obté i printa per consola els noms de totes les taules presents a la BD
        Return d'enllaç: Promise
        Retorn de dades: Void (printa per consola) */
    // private printaInfoBD() {
    //   return this.openBD().then(() => {
    //     return this.storage.executeSql("SELECT * FROM sqlite_master WHERE type='table'", [])
    //   }).then((res : any) => {
    //     console.log('----------------------------------------------------------');
    //     console.log(
    //       'Informacio de la BD ' + '                                     ' +
    //       ' Mostrant ' + res.rows.length + ' de ' + res.rows.length + ' files.'
    //     );
    //     console.log('----------------------------------------------------------');
    //     if(res.rows.length > 0) {
    //       for(let i = 0; i < res.rows.length; i++) {
    //         console.log(i+1 + ': ' + JSON.stringify(res.rows.item(i)));
    //       }
    //     }
    //     else {
    //       console.log('La BD no conte taules');
    //     }
    //     console.log('----------------------------------------------------------');
    //     return;
    //   }).catch((err) => { console.error("ERROR - printaInfoBD: " + err['message']) });
    // }

    /*  tslint:enable */
  /********************************** DEBUGGING TOOLS END *******************************************/
}
