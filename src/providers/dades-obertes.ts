import { Injectable } from '@angular/core';
import { LoadingController} from 'ionic-angular';
import { Http } from '@angular/http';
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

  /*************************************** GESTIO BD ************************************************/
    /*  tslint:disable */

    /*  Genera l'accés a la BD, si ja està obert retorna
        Return d'enllaç: Promise
        Retorn de dades: Promise */
    private obreBD() {
      if(!this.isOpen) {
        return Promise.resolve().then(() => {
          this.storage = new SQLite();
          this.isOpen = true;
          return this.storage.openDatabase({ name: 'data.db', location: 'default' });
        }).catch((err) => {
          console.log('ERROR - obreBD1: ' + err['message']);
          this.isOpen = false;
        });
      } else {
        return Promise.resolve()
        .catch((err) => { console.log('ERROR - obreBD2: ' + err['message'])} );
      }
    }

    /*  Comprova si existeix la taula <nomTaula> a la BD
        Return d'enllaç: Promise
        Retorn de dades: Boolean */
    private existeixTaula(nomTaula: string) {
      return Promise.resolve().then(() => {
        return this.obreBD();
      }).then(() => {
        return this.storage.executeSql("SELECT * FROM sqlite_master WHERE type='table'", []);
      }).then((res : any) => {
        if(res.rows.length > 0) {
          for(let i = 0; i < res.rows.length; i++) {
            if (res.rows.item(i).tbl_name == nomTaula) return true;
          }
        }
        return false;
      }).catch((err) => { console.log('ERROR - existeixTaula: ' + err['message']) });
    }

    /*  Crea la taula <nomTaula> a la BD si no existeix, amb els titols de les columnes <titolsCol> i el seu <contingut>
        Return d'enllaç: Promise
        Retorn de dades: Promise */
    private creaTaula(nomTaula: string, titolsCol: any[]) {
      return Promise.resolve().then(() => {
        return this.obreBD();
      }).then(() => {
        let aux : string[] = [];
        for (var i = 0; i < titolsCol.length; ++i) {
          aux[i] = titolsCol[i] + ' TEXT';
          if (i == 0) aux[i] += ' PRIMARY KEY';
        }
        let titols = aux.join(',');
        return this.storage.executeSql('CREATE TABLE IF NOT EXISTS ' + nomTaula + ' (' + titols + ')', []);
      }).catch((err) => { console.log('ERROR: - creaTaula: ' + err['message']) });
    }

    /*  Retorna el contingut de la taula <nomTaula> si existeix, si no retorna buit
        Return d'enllaç: Promise
        Retorn de dades: Promise(resultat -> Array) */
    private getContingut(nomTaula: string) {
      return Promise.resolve().then(() => {
        return this.obreBD();
      }).then(() => {
        return this.existeixTaula(nomTaula);
      }).then((existeix) => {
        if (!existeix) return '';
        else return this.storage.executeSql('SELECT * FROM ' + nomTaula, []);
      }).catch((err) => { console.log('ERROR - obteContingut: ' + err['message']) });
    }

    /*  Inserta o fa replace del contingut <contingut> a la taula <nomTaula> a través de la primera
        columna (ID) de <titolsCol> */
    private setContingut(nomTaula: string, titolsCol: any[], contingut: any[]) {
      return Promise.resolve().then(() => {
        return this.obreBD();
      }).then(() => {
        return this.existeixTaula(nomTaula);
      }).then((existeixTaula) => {
        if (existeixTaula && titolsCol.length > 0 && contingut.length > 0){
          let aux: any[] = contingut;
          for (var i = 0; i < contingut.length; ++i) {
            for (var j = 0; j < contingut[i].length; ++j) {
              aux[i][j] = "'" + contingut[i][j] + "'";
            }
            aux[i] = '(' + contingut[i].join(',') + ')';
          }
          let titols = titolsCol.join(',');
          let valors = aux.join(',');
          return this.storage.executeSql(
            'INSERT OR REPLACE INTO ' + nomTaula + ' (' + titols + ') ' + 'VALUES ' + valors,
            []
          )
        }
      }).catch((err) => { console.log("ERROR - setContingut: " + err['message']) });
    }

    /*  Retorna el titols de les columnes de la taula <nomTaula> */
    private getTitolsColumnes(nomTaula: string) {
      return Promise.resolve().then(() => {
        return this.obreBD();
      }).then(() => {
        return this.storage.executeSql('PRAGMA table_info('+nomTaula+')',[]);
      }).catch((err) => { console.log('ERROR - getTitolsCol: ' + err['message']) });
    }

    /*  Retorna el valor del camp <camp> de la taula <nomTaula> amb identificador <id> */
    private getCamp(nomTaula: string, idCerca: string, campSelect: string) {
      var columnaID;
      return Promise.resolve().then(() => {
        return this.obreBD();
      }).then(() => {
        return this.existeixTaula(nomTaula);
      }).then((existeix) => {
        if (existeix) return this.getTitolsColumnes(nomTaula);
        else return;
      }).then((titols : any) => {
        if (titols.rows.item(0).name) {
          columnaID = titols.rows.item(0).name;
          return this.storage.executeSql('SELECT ' + campSelect + ' FROM ' + nomTaula + ' WHERE ' + columnaID + "='" + idCerca + "'",[]);
        }
        else return;
      }).then((resultat: any) => {
        if (resultat) return resultat.rows.item(0)[campSelect];
        else return '';
      }).catch((err) => { console.log('ERROR - getCamp: ' + err['message']) });
    }

    /*  Retorna el nombre d'elements d'un dataset de la BD  */
    private getNbElements(nomTaula: string) {
      return Promise.resolve().then(() => {
        return this.obreBD();
      }).then(() => {
        return this.storage.executeSql('SELECT count(*) FROM ' + nomTaula, []);
      }).then((resultat: any) => {
        if (resultat) return resultat.rows.item(0)['count(*)'];
        else return '';
      }).catch((err) => { console.log('ERROR - getNbElements: ' + err['message']) });
    }

    /*  Esborra la taula <nomTaula> de la BD interna si existeix
        Return d'enllaç: Promise
        Retorn de dades: Promise(Void) */
    private borraTaula(nomTaula: string) {
      return Promise.resolve().then(() => {
        return this.obreBD();
      }).then(() => {
        return this.storage.executeSql('DROP TABLE IF EXISTS ' + nomTaula, [])
      }).catch((err) => { console.log('ERROR - borraTaula: ' + err['message']) });
    }

    /*  tslint:enable */
  /************************************* GESTIO BD END **********************************************/

  /***************************************** UTILS **************************************************/
    /*  tslint:disable */

    /*  Retorna si un objecte es Iterable, retorna fals amb strings */
    private esIterable(obj) {
      if (obj == undefined) return false;
      let keys = Object.keys(obj);
      // Comprovem que l'objecte conté indexos i son diferents de 0
      // ja que els strings s'indexen numericament
      return keys.length != 0 && keys[0] != '0';
    }

    /*  Retorna la última data de modificació d'un dataset a la API
        Return d'enllaç: Promise
        Retorn de dades: Promise(resultat -> String) / resultat pot ser: { <data> | undefined } */
    private getDataUpdateAPI(nomDataset: string, token: string) {
      return new Promise((resolve) => {
        this.http.get('http://do.diba.cat/api/info/datasets/dataset/' + nomDataset + '/token/' + token)
        .timeout(5000)
        .map(res => res.json()['modificacio'])
        .subscribe(data => { resolve(data) }, err => { resolve(undefined) });
      }).catch((err) => { console.log('getDataUpdateAPI - Error: ' + err); return undefined; });
    }

    /*  Retorna la informació d'un dataset <nomDataset> de la API
        Return d'enllaç: Promise
        Return de dades: Promise(resultat -> array) */
    private getDataSetAPIContingut(nomDataset: string, token: string, camp_ord: string) {
      return new Promise((resolve) => {
        this.http.get('http://do.diba.cat/api/dataset/' + nomDataset + '/format/JSON/ord-' + camp_ord + '/token/' + token)
        .timeout(5000)
        .map(res => res.json()['elements'])
        .subscribe(data => { resolve(data) });
      })
      .catch((err) => { console.log('getDataSetInfo - Error: ' + err); });
    }

    /*  Retorna l'informació d'un contentType <contentType>, pel municipi <ine> especificat */
    private getContentTypeContingut(contentType: string, ine: string) {
      return new Promise((resolve) => {
        this.http.get('http://do.diba.cat/api/tipus/' + contentType + '/camp-rel_municipis/' + ine)
        .timeout(5000)
        .map((data) => data.json().datasets)
        .subscribe((data) => { resolve(data) });
      })
      .catch((err) => { console.log('getContentTypeInfo - Error: ' + err); });
    }

    /*  Converteix el resultat (elements[]) d'una crida a la API formatejada en JSON a una taula (matriu)
        Return d'enllaç: Promise
        Return de dades: Promise(resultat -> array) */
    private APIData2SqlData(APIData: any) {
      return Promise.resolve()
      .then(() => {
        let indexsAPI = Object.keys(APIData[0]); // Index dels camps de la API, alguns son arrays
        let colTitols = []; // Titols de les columnes de la futura taula
        let contingut = []; // Contingut dels camps de la futura taula

        for (var i = 0; i < indexsAPI.length; ++i) {
          let indexs: string[] = [];

          // Si es iterable agafem els subindexs com a index
          // No cal mantenir una sincronia absoluta amb l'estructura de la API, la comunicació sera d'un sol sentit (API -> BD)
          if (this.esIterable(APIData[0][indexsAPI[i]])) indexs = Object.keys(APIData[0][indexsAPI[i]]);
          else indexs.push(indexsAPI[i]);

          for (var j = 0; j < indexs.length; ++j) {
            colTitols.push(indexs[j]);
          }
        }

        for (var i = 0; i < APIData.length; ++i) {
          let camp = [];
          for (var j = 0; j < indexsAPI.length; ++j) {
            let index = indexsAPI[j];
            let subIndex: string[] = [];

            if (this.esIterable(APIData[i][indexsAPI[j]])) subIndex = Object.keys(APIData[i][indexsAPI[j]]);
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
          contingut.push(camp);
        }
        return [colTitols,contingut];
      })
      .catch((err) => { console.log('APIData2SqlData - Error: ' + err['message']) });
    }

    /*  Formateja el contingut provinent de la API perque tingui una estructura més simple dins la app */
    private formatejaContingut (contingutAPI: any) {
      return Promise.resolve().then(() => {
        if(contingutAPI[0] == undefined) return [];
        let indexsAPI = Object.keys(contingutAPI[0]); // Index dels camps de la API, alguns son arrays
        let dataset = [];
        interface camps {[ind: string]: string};

        for (var i = 0; i < contingutAPI.length; ++i) {
          let element = {} as camps;
          for (var j = 0; j < indexsAPI.length; ++j) {
            let index = indexsAPI[j];
            let subIndex: string[] = [];

            if (this.esIterable(contingutAPI[i][index])) subIndex = Object.keys(contingutAPI[i][index]);
            else subIndex.push('empty');

            for (var z = 0; z < subIndex.length; ++z) {
              let subSubIndex: string[] = [];
              if (subIndex[0] == 'empty') element[index] = contingutAPI[i][index];
              else if (this.esIterable(contingutAPI[i][index][subIndex[z]])) subSubIndex = Object.keys(contingutAPI[i][index][subIndex[z]]);
              else subSubIndex.push('empty');

              for (var w = 0; w < subSubIndex.length; ++w) {
                if (subSubIndex[0] == 'empty') element[subIndex[z]] = contingutAPI[i][index][subIndex[z]];
                else element[subSubIndex[w]] = contingutAPI[i][index][subIndex[z]][subSubIndex[w]];
              }
            }
          }
          element['preferit'] = 'false';
          dataset.push(element);
        }
        return dataset;
      }).catch((err) => { console.log('ERROR - formatejaContingut: ' + err['message']) });
    }

    /*  tslint:enable */
  /*************************************** UTILS END ************************************************/

  /********************************* CRIDES APP +MUNICIPIS ******************************************/
    /*  Caniva l'estat "preferit" d'un municipi  */
    public canviaPreferit(ine: string) {
      var pref = this.municipisInfo[this.indexMunicipis[ine]]['preferit'];
      if (pref == true) pref = this.municipisInfo[this.indexMunicipis[ine]]['preferit'] = false;
      else pref = this.municipisInfo[this.indexMunicipis[ine]]['preferit'] = true;
      return this.storage.executeSql("UPDATE municipis SET preferit='" + String(pref) + "' WHERE ine ='" + ine + "'",[])
      .catch((err) => { console.log('ERROR - canviaPreferit: ' + err['message']) });
    }

    /*  Carrega desde la API de dades Obertes el dataset Municipis amb els elements ordenats per municipi transliterat */
    public carregaMunicipis(loading: any) {
      return Promise.resolve().then(() => {
        return this.getDataSetAPIContingut('municipis','','municipi_transliterat');
      }).then((contingutAPI) => {
        return this.formatejaContingut(contingutAPI);
      }).then((contingutFormatejat: any) => {
        return this.existeixTaula('municipis').then((existeix) => {
          if (!existeix) {
            return this.creaTaula('municipis',['ine','municipi_transliterat','preferit']).then(() => {
              let elements = [];
              for (var i = 0; i < contingutFormatejat.length; ++i) {
                elements.push([contingutFormatejat[i]['ine'],contingutFormatejat[i]['municipi_transliterat'],'false']);
              }
              return this.setContingut('municipis',['ine','municipi_transliterat','preferit'],elements);
            })
          }
        }).then(() => {
          return this.getContingut('municipis').then((contingut) => {
            for (var i = 0; i < contingut.rows.length; ++i) {
              this.indexMunicipis[contingut.rows.item(i)['ine']] = i;
              if(contingut.rows.item(i)['preferit'] == 'true') contingutFormatejat[i]['preferit'] = true;
              else contingutFormatejat[i]['preferit'] = false;
            }
            this.municipisInfo = contingutFormatejat;
            return loading.dismiss();
          })
        })
      }).catch((err) => { console.log('ERROR - carregaMunicipis: ' + err['message']) });
    }

    /*  Consulta el <valorCerca> a la API i retorna les claus dels municipis dins el vector municipisInfo */
    public redueixFiltrats(arrayIndexsFiltrats: number[], valorCerca : any) {
      let munFil : any;
      let comFil : any;
      return new Promise(resolve => {
        this.http.get('http://do.diba.cat/api/dataset/municipis/format/JSON/ord-municipi_transliterat/camp-municipi_nom-like/'+valorCerca)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
        err => console.error(err)
      }).then((municipis) => {
        munFil = municipis;
        return new Promise(resolve => {
          this.http.get('http://do.diba.cat/api/dataset/municipis/format/JSON/ord-municipi_transliterat/camp-comarca_nom-like/'+valorCerca)
          .map(res => res.json())
          .subscribe(data => {
            resolve(data);
          });
          err => console.error(err)
        })
      }).then((comarques) => {
        comFil = comarques;
        arrayIndexsFiltrats = [];
        for (var i = 0; i < munFil['entitats']; i++) {
          arrayIndexsFiltrats.push(this.indexMunicipis[munFil['elements'][i]['ine']]);
        }
        for (var i = 0; i < comFil['entitats']; i++) {
          arrayIndexsFiltrats.push(this.indexMunicipis[comFil['elements'][i]['ine']]);
        }
        arrayIndexsFiltrats = arrayIndexsFiltrats.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
        });
        return arrayIndexsFiltrats;
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
      }).catch((err) => { console.log('ERROR - carregaPunts: ' + err['message']) });
    }
    */


  /******************************* CRIDES APP +MUNICIPIS END ****************************************/

  /************************************ DEBUGGING TOOLS *********************************************/
    /*  tslint:disable */

    /*  Obté el contingut de la taula <nomTaula> i el mostra per consola amb <numFil> especificat
        Return d'enllaç: Promise
        Retorn de dades: Void (printa per consola) */
    private printaInfoTaula(nomTaula: string, numFil: number) {
      return Promise.resolve().then(() => {
        return this.obreBD()
      }).then(() => {
        return this.existeixTaula(nomTaula);
      }).then((existeixTaula : any) => {
        if (existeixTaula) return this.storage.executeSql('SELECT * FROM ' + nomTaula + ' ORDER BY ROWID', []);
        else return '';
      }).then((data : any) => {
        if (data) {
          if (numFil > data.rows.length) numFil = data.rows.length;
          console.log('----------------------------------------------------------');
          console.log(
            'Informacio de la taula: ' + nomTaula + '                       ' +
            ' Mostrant ' + numFil + ' de ' + data.rows.length + ' files.'
            );
          console.log('----------------------------------------------------------');
          if(data.rows.length > 0) {
            for(let i = 0; i < numFil; i++) {
              console.log(i+1 + ': ' + JSON.stringify(data.rows.item(i)));
            }
          }
          else {
            console.log('La taula és buida');
          }
          console.log('----------------------------------------------------------');
          return;
        }
        else {
          console.log('----------------------------------------------------------');
          console.log('La taula ' + nomTaula + ' no existeix.');
          console.log('----------------------------------------------------------');
        }
      }).catch((err) => { console.log('ERROR - printaInfoTaula: ' + err['message']) });
    }

    /*  Obté i printa per consola els noms de totes les taules presents a la BD
        Return d'enllaç: Promise
        Retorn de dades: Void (printa per consola) */
    private printaInfoBD() {
      return this.obreBD().then(() => {
        return this.storage.executeSql("SELECT * FROM sqlite_master WHERE type='table'", [])
      }).then((res : any) => {
        console.log('----------------------------------------------------------');
        console.log(
          'Informacio de la BD ' + '                                     ' +
          ' Mostrant ' + res.rows.length + ' de ' + res.rows.length + ' files.'
        );
        console.log('----------------------------------------------------------');
        if(res.rows.length > 0) {
          for(let i = 0; i < res.rows.length; i++) {
            console.log(i+1 + ': ' + JSON.stringify(res.rows.item(i)));
          }
        }
        else {
          console.log('La BD no conte taules');
        }
        console.log('----------------------------------------------------------');
        return;
      }).catch((err) => { console.log("ERROR - printaInfoBD: " + err['message']) });
    }

    /*  tslint:enable */
  /********************************** DEBUGGING TOOLS END *******************************************/
}
