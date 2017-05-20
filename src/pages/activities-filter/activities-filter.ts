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

  constructor(
    public viewCtrl: ViewController, 
    public navParams: NavParams,
    public openData: OpenData,
  ) {
    this.selectedIne = navParams.data.ine || '';
  }

  ionViewDidLoad() {
    let orderBy: any = [{"fieldName":"municipi_transliterat","order":"asc"}];
    this.openData.getDatasetAPIContent('municipis', orderBy).subscribe((data: any) => {
      data.elements.forEach((elem: any) => {
        let municipi: any = {"ine":elem.ine, "nom":elem.municipi_nom};
        this.municipis.push(municipi);
      });
    });
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    /*let excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedTrackNames);*/
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }

}
