import { Component } from '@angular/core';

import { NavController, ModalController, Refresher } from 'ionic-angular';

import { ActivitiesFilterPage } from '../activities-filter/activities-filter';

import { ParamsData } from '../../providers/params-data';

@Component({
  selector: 'page-activities-list',
  templateUrl: 'activities-list.html'
})

export class ActivitiesListPage {
  private ine;
  private queryText = '';
  private filters: any = [];
	private data: any = [];
  private shownData: any = [];

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public paramsData: ParamsData
  ) {
    this.ine = paramsData.params.ine;
  }

  updateList() {
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
        this.updateList();
      }
    });
  }

}
