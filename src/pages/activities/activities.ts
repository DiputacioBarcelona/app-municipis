import { Component } from '@angular/core';
import { NavController,  NavParams } from 'ionic-angular';

@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html'
})

export class ActivitiesPage {
  private ine;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.ine = navParams.get('ine');
  }

  ionViewDidLoad() {
    console.log(this.ine);
  }

}
