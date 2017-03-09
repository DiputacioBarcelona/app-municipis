import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RepositoriDadesObertes } from '../../providers/dades-obertes';


@Component({
  selector: 'page-punts',
  templateUrl: 'punts.html'
})
export class PuntsPage {
  public ine;
  public temaActual;

  constructor(public navCtrl: NavController, private navParams: NavParams, private doProvider: RepositoriDadesObertes) {
    this.ine = navParams.get('ine');
  }

  ionViewDidLoad() {
    //this.doProvider.carregaPunts(this.ine);
    //this.temaActual = this.doProvider.puntsInfo[0]['tema'];
    //console.log(this.doProvider.puntsInfo[0]);
  }

}
