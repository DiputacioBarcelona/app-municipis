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
  private ine: string;
  private queryText = '';
  /*private filters: any = {};*/
	private data: any = [];
  private shownData: any = [];
  private total: number;
  private pageSize: number = 10;
  private lastQueryText = '';

  private start: number = 1;


  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public openData: OpenData,
    public paramsData: ParamsData,
    public translate: TranslateService
  ) {
    this.ine = paramsData.params.ine;
    /*this.filters.ine = this.ine;*/
  }

  ionViewDidLoad() {
    this.updateList();
	}

  updateList() {
  
    return new Promise(resolve => {
      let msg = 'Espereu siusplau...';
      this.translate.get('MUNICIPIS.LOADING_MESSAGE').subscribe((res: string) => {
          msg = res;
      });

      let loading = this.loadingCtrl.create({ content: msg });
      loading.present();

      if (this.lastQueryText != this.queryText) {
        this.start = 1;
        this.data = [];
      }

      this.openData.getActivities('actesparcs', this.queryText, this.start, this.start + this.pageSize - 1, this.ine)
      .subscribe((data: any) => {
        for(let elem of data.elements) {
          this.data.push(elem);
        }
        this.shownData = data.elements.length;
        this.total = data.entitats;
        this.lastQueryText = this.queryText;
        loading.dismiss();
        resolve(true);
      });
            
    });

	}

  doInfinite(infiniteScroll:any) {     
     this.start += this.pageSize;

     if (this.start < this.total){
        this.updateList().then(()=>{       
          infiniteScroll.complete();
        });
     } else {
       infiniteScroll.complete();
     }

  }

	goToActivityDetail(activityData: any) {
    this.navCtrl.push(ActivitiesDetailPage, {
      activity: activityData
    });
	}

  presentFilter() {
    let modal = this.modalCtrl.create(ActivitiesFilterPage, {
      ine: this.ine
    });
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        /*this.filters.ine = this.ine;*/
        this.updateList();
      }
    });
  }

}
