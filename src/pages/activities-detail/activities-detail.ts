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
  }

  share(socialNet: string, fab: FabContainer) {
    console.log("Sharing in" + socialNet);
    fab.close();
  }

  openMap() {
    console.log("Open map");
  }

  arrayToString(text: any){
      return text.join(", ");
  };

  openMail(email) {
    window.open(`mailto:${email}`, '_system', 'location=yes');
  }

  openTel(telf) {
    window.open(`telf:${telf}`, '_system', 'location=yes');
  }

  openLink(link) {
    console.log('openLink: ' + link);
    console.log(link);
    window.open(`${link}`, '_system', 'location=yes');
  }

}
