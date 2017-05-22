import { Component } from '@angular/core';
import { NavController, LoadingController, ItemSliding, AlertController, Events, Refresher } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate'

import { MunicipisDetailPage } from '../municipis-detail/municipis-detail';

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
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public openData: OpenData,
		public userData: UserData,
    public translate: TranslateService,
    public events: Events
	) {}

	ionViewDidLoad() {
    this.updateList();
    this.events.subscribe('MunicipiDetailPage:removeFavorite', eventData => { 
      this.updateList();
    });
	}

  doRefresh(refresher: Refresher) {
    this.openData.getMunicipis(this.queryText, this.segment).subscribe((data: any) => {
      this.data = data;
      this.shownData = data.shownData;
			refresher.complete();
    });
  }

	updateList() {
    let msg = 'Espereu siusplau...';
    this.translate.get('MUNICIPIS.LOADING_MESSAGE').subscribe((res: string) => {
        msg = res;
    });

		let loading = this.loadingCtrl.create({ content: msg });
		loading.present();

		this.openData.getMunicipis(this.queryText, this.segment).subscribe((data: any) => {
      this.data = data;
      this.shownData = data.shownData;
			loading.dismiss();
    });
	}

	goToMunicipiDetail(municipiData: any) {
    this.navCtrl.push(MunicipisDetailPage, {
      municipi: municipiData
    });
	}

	addFavorite(slidingItem: ItemSliding, municipiData: any) {
    let msg_added = '';
    this.translate.get('MUNICIPIS.FAVORITE_ADDED', {value: municipiData.municipi_nom}).subscribe((res: string) => {
        msg_added = res;
    });
    let msg_ok = '';
    this.translate.get('APP.OK').subscribe((res: string) => {
        msg_ok = res;
    });
    if (this.userData.hasFavoriteMunicipis(municipiData.ine)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, municipiData, false);
    } else {
      // remember this municipi as a userData favorite
      this.userData.addFavoriteMunicipis(municipiData.ine);

      // create an alert instance
      let alert = this.alertCtrl.create({
        message: msg_added,
        buttons: [{
          text: msg_ok,
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

  removeFavorite(slidingItem: ItemSliding, municipiData: any, fromFavourites: boolean) {
    let title = '';
    if (fromFavourites) {
      this.translate.get('MUNICIPIS.REMOVE_FAVORITE').subscribe((res: string) => {
        title = res;
    });
    } else {
      this.translate.get('MUNICIPIS.FAVORITE_ALREADY_ADDED').subscribe((res: string) => {
          title = res;
      });
    }
    let msg_remove_favorites = '';
    this.translate.get('MUNICIPIS.REMOVE_FAVORITES', {value: municipiData.municipi_nom}).subscribe((res: string) => {
        msg_remove_favorites = res;
    });
    let msg_cancel = '';
    this.translate.get('APP.CANCEL').subscribe((res: string) => {
        msg_cancel = res;
    });
    let msg_remove = '';
    this.translate.get('MUNICIPIS.REMOVE').subscribe((res: string) => {
        msg_remove = res;
    });
    let alert = this.alertCtrl.create({
      title: title,
      message: msg_remove_favorites,
      buttons: [
        {
          text: msg_cancel,
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: msg_remove,
          handler: () => {
            // they want to remove this session from their favorites
            this.userData.removeFavoriteMunicipis(municipiData.ine);
            this.updateList();

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
