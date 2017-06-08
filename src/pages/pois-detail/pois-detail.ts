import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-pois-detail',
  templateUrl: 'pois-detail.html'
})
export class PoisDetailPage {
  private poi: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public socialSharing: SocialSharing
  ) {
      this.poi = this.navParams.data.poi;
  }

  share(socialNet: string, fab: FabContainer) {
    let imatge = '';
    if (this.poi.imatge.length > 0){
      imatge = this.poi.imatge['0'];
    }
    if(socialNet == 'Twitter') {
      this.socialSharing.shareViaTwitter(this.poi.adreca_nom, 
                                        imatge, 
                                        this.poi.url_general);
    } else if(socialNet == 'Facebook') {
      this.socialSharing.shareViaFacebook(this.poi.adreca_nom, 
                                        imatge, 
                                        this.poi.url_general);
    } else if(socialNet == 'Whatsapp') {
      this.socialSharing.shareViaWhatsApp(this.poi.adreca_nom, 
                                        imatge, 
                                        this.poi.url_general);
    } else if(socialNet == 'Mail') {
      this.socialSharing.shareViaEmail(this.poi.descripcio, this.poi.adreca_nom,
                                      [''],[''],[''],[imatge]);
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
