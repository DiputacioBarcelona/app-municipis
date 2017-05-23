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
  private categories: any = [];
  private selectedCat: string;
  private datasets: Array<{nom: string, machinename: string, isChecked: boolean}> = [];
  private excludedDatasetsNames: any = [];

  constructor(
    public viewCtrl: ViewController, 
    public navParams: NavParams,
    public openData: OpenData,
  ) {
    this.selectedIne = navParams.data.ine || '';
    this.iniDate = navParams.data.iniDate || '';
    this.fiDate = navParams.data.fiDate || '';
    this.selectedCat = navParams.data.category || '';
    this.excludedDatasetsNames = this.navParams.data.excludedDatasetsNames || [];
    this.openData.getMuncipisCombo().subscribe((data: any) => {
      this.municipis = data;
    });
    this.openData.getDibaCategoriesCombo().subscribe((data: any) => {
      this.categories = data;
    });

    this.openData.getDatasetsActe().subscribe((data: any) => {
      data.forEach(dataset => {
        this.datasets.push({
          nom: dataset.nom,
          machinename: dataset.machinename,
          isChecked: (this.excludedDatasetsNames.indexOf(dataset.machinename) === -1)
        });
      }); 
    });
  }

  applyFilters() {
    this.excludedDatasetsNames = this.datasets.filter(c => !c.isChecked).map(c => c.machinename);
    this.dismiss({
      ine: this.selectedIne,
      iniDate: this.iniDate,
      fiDate: this.fiDate,
      category: this.selectedCat,
      excludedDatasetsNames: this.excludedDatasetsNames
    });
  }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }

  resetFilters() {
    this.datasets.forEach(dataset => {
      dataset.isChecked = true;
    });
    this.selectedIne = '';
    this.iniDate = '';
    this.fiDate = '';
    this.selectedCat = '';
  }

}
