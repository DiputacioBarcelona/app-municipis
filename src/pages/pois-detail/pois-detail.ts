import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer } from 'ionic-angular';

@Component({
  selector: 'page-pois-detail',
  templateUrl: 'pois-detail.html'
})
export class PoisDetailPage {
  private poi: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
      this.poi = this.navParams.data.poi;
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
    window.open('tel:'+telf);
  }

  openLink(link) {
    console.log('openLink: ' + link);
    console.log(link);
    window.open(`${link}`, '_system', 'location=yes');
  }

}
