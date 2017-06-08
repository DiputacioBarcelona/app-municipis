import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-activities-detail',
  templateUrl: 'activities-detail.html'
})
export class ActivitiesDetailPage {
  private activity: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public socialSharing: SocialSharing
  ) {
      this.activity = this.navParams.data.activity;
  }

  share(socialNet: string, fab: FabContainer) {
    let imatge = '';
    if (this.activity.imatge.length > 0){
      imatge = this.activity.imatge['0'];
    }
    if(socialNet == 'Twitter') {
      this.socialSharing.shareViaTwitter(this.activity.titol, 
                                        imatge, 
                                        this.activity.url_general);
    } else if(socialNet == 'Facebook') {
      this.socialSharing.shareViaFacebook(this.activity.titol, 
                                        imatge, 
                                        this.activity.url_general);
    } else if(socialNet == 'Whatsapp') {
      this.socialSharing.shareViaWhatsApp(this.activity.titol, 
                                        imatge, 
                                        this.activity.url_general);
    } else if(socialNet == 'Mail') {
      this.socialSharing.shareViaEmail(this.activity.descripcio, 
                                      this.activity.titol, [''],
                                      [''],[''],[imatge]);
    }
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
