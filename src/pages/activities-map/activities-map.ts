import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-activities-map',
  templateUrl: 'activities-map.html'
})

export class ActivitiesMapPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivitiesMapPage');
  }

}
