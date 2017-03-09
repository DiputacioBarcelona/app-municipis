import { Component } from '@angular/core';
import { NavController,  NavParams } from 'ionic-angular';

/*
  Generated class for the Activitats page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-activitats',
  templateUrl: 'activitats.html'
})
export class ActivitatsPage {
  private ine;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.ine = navParams.get('ine');
  }

  ionViewDidLoad() {
    console.log(this.ine);
  }

}
