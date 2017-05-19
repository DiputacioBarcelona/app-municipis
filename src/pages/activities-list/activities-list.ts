import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, Refresher } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate'

import { ActivitiesFilterPage } from '../activities-filter/activities-filter';
import { ActivitiesDetailPage } from '../activities-detail/activities-detail';

import { OpenData } from '../../providers/open-data';
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
    public loadingCtrl: LoadingController,
    public openData: OpenData,
    public paramsData: ParamsData,
    public translate: TranslateService
  ) {
    this.ine = paramsData.params.ine;
  }

  ionViewDidLoad() {
    this.updateList();
	}

  doRefresh(refresher: Refresher) {
    this.openData.getActivities(this.queryText).subscribe((data: any) => {
      this.data = data;
      this.shownData = data.shownData;
			refresher.complete();
    });
    refresher.complete();
  }

  updateList() {
    let msg = 'Espereu siusplau...';
    this.translate.get('MUNICIPIS.LOADING_MESSAGE').subscribe((res: string) => {
        msg = res;
    });

		let loading = this.loadingCtrl.create({ content: msg });
		loading.present();

		this.openData.getActivities(this.queryText).subscribe((data: any) => {
      this.data = data.elements;
      this.shownData = data.elements.length > 0;
			loading.dismiss();
    });
	}

	goToActivityDetail(activityData: any) {
    this.navCtrl.push(ActivitiesDetailPage, {
      activity: activityData
    });
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
