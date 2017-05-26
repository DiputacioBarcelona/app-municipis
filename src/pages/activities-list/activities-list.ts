import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

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
  private lastIne = '';
  private queryText = '';
  private lastQueryText = '';
	private data: any = [];
  private shownData: any = [];
  private total: number;
  private start: number = 1;
  private pageSize: number = 10;
  private iniDate: string;
  private fiDate: string;
  private category: string;
  private lastCategory = '';
  private excludedDatasetsNames: any = [];
  private lastExcludedDatasetsNames: any = [];

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

  updateList() {
  
    return new Promise(resolve => {
      let msg = 'Espereu siusplau...';
      this.translate.get('APP.LOADING_MESSAGE').subscribe((res: string) => {
          msg = res;
      });

      let loading = this.loadingCtrl.create({ content: msg });
      loading.present();

      if (this.lastQueryText != this.queryText || this.lastIne != this.ine 
          || this.lastCategory != this.category  || this.lastExcludedDatasetsNames != this.excludedDatasetsNames) {
        this.start = 1;
        this.data = [];
      }

      this.openData.getActivities(this.queryText, this.start, this.start + this.pageSize - 1, 
                                  this.ine, this.iniDate, this.fiDate, this.category, this.excludedDatasetsNames)
      .subscribe((data: any) => {
        for(let elem of data) {
          this.data.push(elem);
        }
        this.shownData = this.data.length;
        this.total = data.entitats;
        this.lastQueryText = this.queryText;
        this.lastIne = this.ine;
        this.lastCategory = this.category;
        this.lastExcludedDatasetsNames =  this.excludedDatasetsNames;
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
      ine: this.ine,
      iniDate: this.iniDate,
      fiDate: this.fiDate,
      category: this.category,
      excludedDatasetsNames: this.excludedDatasetsNames
    });
    modal.present();

    modal.onWillDismiss((data: any) => {
      if (data) {
        this.ine = data.ine;
        this.iniDate = data.iniDate;
        this.fiDate = data.fiDate;
        this.category = data.category;
        this.excludedDatasetsNames = data.excludedDatasetsNames;
        this.updateList();
      }
    });
  }

}
