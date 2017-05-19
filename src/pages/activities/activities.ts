import { Component } from '@angular/core';
import { NavController,  NavParams, ModalController, Refresher } from 'ionic-angular';

import { ActivitiesFilterPage } from '../activities-filter/activities-filter';

@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html'
})

export class ActivitiesPage {
  private ine;
  queryText = '';
  filters: any = [];

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.ine = navParams.get('ine');
  }

  ionViewDidLoad() {
    /*console.log('ionViewDidLoad - ActivitiesPage: ' + this.ine);*/
  }

  updateData() {
  }

  doRefresh(refresher: Refresher) {
    /*this.openData.getMunicipis(this.queryText, this.segment).subscribe((data: any) => {
      this.data = data;
      this.shownData = data.shownData;
			refresher.complete();
    });*/
    refresher.complete();
  }

  presentFilter() {
    let modal = this.modalCtrl.create(ActivitiesFilterPage, this.filters);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        this.filters = data;
        this.updateData();
      }
    });
  }

}
