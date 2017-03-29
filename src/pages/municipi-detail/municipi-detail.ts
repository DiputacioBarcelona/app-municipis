import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PoisPage } from '../pois/pois';
import { ActivitiesPage } from '../activities/activities';

import { OpenData } from '../../providers/open-data';

@Component({
  selector: 'page-municipi_detail',
  templateUrl: 'municipi-detail.html'
})

export class MunicipiDetailPage {
  public index;
  public favourite;
  private ine;

  constructor(public navCtrl: NavController, private navParams: NavParams, private openData: OpenData) {
    this.ine = navParams.get('ine');
  }

  ionViewDidLoad() {
    this.index = this.openData.indexMunicipis[this.ine];
    this.favourite = this.openData.municipisInfo[this.index]['favourite'];
  }

  toggleFavourite() {
    this.favourite = !this.favourite;
    this.openData.toggleFavourite(this.ine);
  }

  goToPois(index: string) {
    this.navCtrl.push(PoisPage,{ine : this.ine});
  }

  goToActivities(index: string) {
    this.navCtrl.push(ActivitiesPage,{ine : this.ine});
  }
}
