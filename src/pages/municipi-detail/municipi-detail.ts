import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RepositoriDadesObertes } from '../../providers/dades-obertes';
import { PoisPage } from '../pois/pois';
import { ActivitiesPage } from '../activities/activities';


@Component({
  selector: 'page-municipi_detail',
  templateUrl: 'municipi-detail.html'
})
export class MunicipiDetailPage {
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
    this.navCtrl.push(PoisPage,{ine : this.ine});
  }

  entraPaginaActivitats(index: string) {
    this.navCtrl.push(ActivitiesPage,{ine : this.ine});
  }
}
