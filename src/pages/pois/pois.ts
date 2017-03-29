import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OpenData } from '../../providers/open-data';

@Component({
  selector: 'page-pois',
  templateUrl: 'pois.html'
})

export class PoisPage {
  public ine;
  //public temaActual;

  constructor(public navCtrl: NavController, private navParams: NavParams, private openData: OpenData) {
    this.ine = navParams.get('ine');
  }

  ionViewDidLoad() {
    //this.openData.carregaPunts(this.ine);
    //this.temaActual = this.openData.puntsInfo[0]['tema'];
    //console.log(this.openData.puntsInfo[0]);
  }

}
