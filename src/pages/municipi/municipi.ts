import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RepositoriDadesObertes } from '../../providers/dades-obertes';
import { PuntsPage } from '../punts/punts';
import { ActivitatsPage } from '../activitats/activitats';


@Component({
  selector: 'page-municipi',
  templateUrl: 'municipi.html'
})
export class MunicipiPage {
  public index;
  public preferit;
  private ine;

  constructor(public navCtrl: NavController, private navParams: NavParams, private doProvider: RepositoriDadesObertes) {
    this.ine = navParams.get('ine');
  }

  ionViewDidLoad() {
    this.index = this.doProvider.indexMunicipis[this.ine];
    this.preferit = this.doProvider.municipisInfo[this.index]['preferit'];
  }

  canviaPreferit() {
    this.preferit = !this.preferit;
    this.doProvider.canviaPreferit(this.ine);
  }

  entraPaginaPunts(index: string) {
    this.navCtrl.push(PuntsPage,{ine : this.ine});
  }

  entraPaginaActivitats(index: string) {
    this.navCtrl.push(ActivitatsPage,{ine : this.ine});
  }
}
