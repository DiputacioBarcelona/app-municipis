import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

@Component({
  selector: 'page-pois-detail',
  templateUrl: 'pois-detail.html'
})
export class PoisDetailPage {
  private poi: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public socialSharing: SocialSharing,
    public launchNavigator: LaunchNavigator
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
    this.launchNavigator.isAppAvailable(this.launchNavigator.APP.GOOGLE_MAPS).then((isAvailable) => {
      var app;
      if (isAvailable) {
          app = this.launchNavigator.APP.GOOGLE_MAPS;
      } else {
          console.warn("Google Maps not available - falling back to user selection");
          app = this.launchNavigator.APP.USER_SELECT;
      }

      let options: LaunchNavigatorOptions = {
        app: app
      };

      this.launchNavigator.navigate(this.poi.localitzacio, options)
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
    }).catch((error) => {
      console.log('Error launching navigator', error);
    });
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
