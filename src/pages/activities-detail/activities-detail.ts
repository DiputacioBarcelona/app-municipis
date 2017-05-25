import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer } from 'ionic-angular';

@Component({
  selector: 'page-activities-detail',
  templateUrl: 'activities-detail.html'
})
export class ActivitiesDetailPage {
  private activity: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.activity = this.navParams.data.activity;
      console.log('alla va');
      console.log(this.activity.imatge);
  }

  share(socialNet: string, fab: FabContainer) {
    console.log("Sharing in" + socialNet);
    fab.close();
  }

  openMap() {
    console.log("Open map");
  }

}
