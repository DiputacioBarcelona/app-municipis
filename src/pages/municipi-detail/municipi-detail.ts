import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PoisPage } from '../pois/pois';
import { ActivitiesPage } from '../activities/activities';

import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-municipi_detail',
  templateUrl: 'municipi-detail.html'
})

export class MunicipiDetailPage {
  municipi: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public userData: UserData) {
    this.municipi = navParams.data.municipi;
  }

  goToPois(index: string) {
    this.navCtrl.push(PoisPage,{ine : this.municipi.ine});
  };

  goToActivities(index: string) {
    this.navCtrl.push(ActivitiesPage,{ine : this.municipi.ine});
  };

	toggleFavourite(ine: string) {
		this.userData.toggleFavourite(ine);
	};
}
