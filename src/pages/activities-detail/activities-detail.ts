import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

@Component({
  selector: 'page-activities-detail',
  templateUrl: 'activities-detail.html'
})
export class ActivitiesDetailPage {
  private activity: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public socialSharing: SocialSharing,
    public launchNavigator: LaunchNavigator
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

      this.launchNavigator.navigate(this.activity.grup_adreca.localitzacio, options)
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
