import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { OpenData } from '../../providers/open-data';

@Component({
  selector: 'page-activities-filter',
  templateUrl: 'activities-filter.html'
})

export class ActivitiesFilterPage {
  private municipis: any = [];
  private selectedIne: string;
  private iniDate: string;
  private fiDate: string;

  constructor(
    public viewCtrl: ViewController, 
    public navParams: NavParams,
    public openData: OpenData,
  ) {
    this.selectedIne = navParams.data.ine || '';
    this.iniDate = navParams.data.iniDate || '';
    this.fiDate = navParams.data.fiDate || '';
    this.openData.getMuncipisCombo().subscribe((data: any) => {
      this.municipis = data;
    });
  }

  applyFilters() {
    this.dismiss({
      ine: this.selectedIne,
      iniDate: this.iniDate,
      fiDate: this.fiDate
    });
  }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }

}
