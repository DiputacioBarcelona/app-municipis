import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the ActivitiesFilter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-activities-filter',
  templateUrl: 'activities-filter.html'
})
export class ActivitiesFilterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivitiesFilterPage');
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    /*let excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedTrackNames);*/
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    /*this.viewCtrl.dismiss(data);*/
  }

}
