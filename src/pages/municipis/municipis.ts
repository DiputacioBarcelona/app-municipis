import { Component } from '@angular/core';
import { NavController, App, LoadingController, ItemSliding, AlertController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate'

import { MunicipiDetailPage } from '../municipi-detail/municipi-detail';

import { OpenData } from '../../providers/open-data';
import { UserData } from '../../providers/user-data';

@Component({
	selector: 'page-municipis',
	templateUrl: 'municipis.html'
})

export class MunicipisPage {  
	queryText = '';
	segment = 'all';
	data: any = [];
  shownData: any = [];

	constructor(
		public alertCtrl: AlertController,
		public app: App,
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public openData: OpenData,
		public userData: UserData,
    public translate: TranslateService
	) {}

	ionViewDidLoad() {
		this.app.setTitle('Muncipis-Schedule');
    this.updateSchedule();
	}

	updateSchedule() {
    let msg = 'Espereu siusplau...';
    this.translate.get('LOADING_MESSAGE').subscribe((res: string) => {
        msg = res;
    });

		let loading = this.loadingCtrl.create({ content: msg });
		loading.present();

		this.openData.getMunicipis(this.queryText, this.segment).subscribe((data: any) => {
      this.data = data.elements;
      this.shownData = data.shownData;
			loading.dismiss();
    });
	}

	goToMunicipiDetail(municipiData: any) {
		// go to the municipi detail page
    // and pass in the municipi data
    this.navCtrl.push(MunicipiDetailPage, {
      municipi: municipiData
    });
	}

	addFavorite(slidingItem: ItemSliding, municipiData: any) {
    if (this.userData.hasFavorite(municipiData.ine)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, municipiData, 'Favorite already added');
    } else {
      // remember this municipi as a userData favorite
      this.userData.addFavorite(municipiData.ine);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, municipiData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this municipi from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.userData.removeFavorite(municipiData.ine);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

}
