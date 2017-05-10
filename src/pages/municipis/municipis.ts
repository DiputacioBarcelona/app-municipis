import { Component } from '@angular/core';
import { NavController, LoadingController, ItemSliding, AlertController } from 'ionic-angular';

import { MunicipiDetailPage } from '../municipi-detail/municipi-detail';

import { OpenData } from '../../providers/open-data';
import { UserData } from '../../providers/user-data';

@Component({
	selector: 'page-municipis',
	templateUrl: 'municipis.html'
})

export class MunicipisPage {
	pageSize: number;
	appliedFilter: number[];
	segment = 'all';

	constructor(
		public alertCtrl: AlertController,
		public navCtrl: NavController, 
		public openData: OpenData, 
		public loadingCtrl: LoadingController,
		public user: UserData
	) {}

	/*	Executed when the page is loaded. Only runs once per page created. */
	ionViewDidLoad() {
		this.pageSize = 10;
		this.appliedFilter  = [];

		let loading = this.loadingCtrl.create({ content: 'Espereu siusplau...' });
		loading.present();
		this.openData.loadMunicipis(loading)
		.catch((err) => { console.error('municipis(ionViewDidLoad) - Error: ' + err) });
	}

	updateSchedule() {
	}

	/*	Apply Filter asking API */
	searchMunicipis(event:any) {
		let val = event.target.value;
		if (!val || val.trim() == '') return this.appliedFilter  = [];;

		// this.openData.reduceFiltering(this.appliedFilter ,val).then((resultat: any) => {
		// 	if (resultat[0] == undefined) {
		// 		this.appliedFilter  = [];
		// 		this.appliedFilter [0] = -1;
		// 	}
		// 	else this.appliedFilter  = resultat;
		// }).catch((err) => {console.error('ERROR - searchMunicipis: ' + err['message'])});
	}

	/* Responsible for the infinite scroll */
	doInfinite(infiniteScroll) {
		if (this.appliedFilter [0] == undefined && this.appliedFilter [0] != -1 && this.pageSize < this.openData.municipisInfo.length) this.pageSize++;
		return infiniteScroll.complete();
	}

	/*	Navigation page of the selected municipi */
	goToMunicipiDetail(municipiData: any) {
		// go to the municipi detail page
    // and pass in the municipi data
    this.navCtrl.push(MunicipiDetailPage, {
      ine: municipiData.ine,
      municipi: municipiData
    });
	}

	addFavorite(slidingItem: ItemSliding, municipiData: any) {

    if (this.user.hasFavorite(municipiData.ine)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, municipiData, 'Favorite already added');
    } else {
      // remember this municipi as a user favorite
      this.user.addFavorite(municipiData.ine);

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
            this.user.removeFavorite(municipiData.ine);
            //this.updateSchedule();

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
