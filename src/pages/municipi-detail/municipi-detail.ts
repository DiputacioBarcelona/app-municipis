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
  // public index;
  // //public favourite;
  // private ine;
  municipi: any;

  constructor(public navCtrl: NavController, private navParams: NavParams, private openData: OpenData) {
    // this.ine = navParams.get('ine');
    this.municipi = navParams.data.municipi;
  }

  // /*	Executed when the page is loaded. Only runs once per page created. */
  // ionViewDidLoad() {
  //   this.index = this.openData.indexMunicipis[this.ine];
  //   console.log('INDEX: '+ this.index);
  //   console.log('INE: '+ this.ine);
  //   //this.favourite = this.openData.municipisInfo[this.index]['favourite'];
  // }

  toggleFavourite() {
    // this.favourite = !this.favourite;
    this.openData.toggleFavourite(this.municipi.ine);
  }

  goToPois(index: string) {
    this.navCtrl.push(PoisPage,{ine : this.municipi.ine});
  }

  goToActivities(index: string) {
    this.navCtrl.push(ActivitiesPage,{ine : this.municipi.ine});
  }
}
