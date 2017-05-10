import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';

import { MunicipiDetailPage } from '../municipi-detail/municipi-detail';

import { OpenData } from '../../providers/open-data';

@Component({
	selector: 'page-municipis',
	templateUrl: 'municipis.html'
})

export class MunicipisPage {
	public pageSize: number;
	public appliedFilter: number[];

	constructor(public navCtrl: NavController, public openData: OpenData, public loadingCtrl: LoadingController) {}

	/*	Executed when the page is loaded. Only runs once per page created. */
	ionViewDidLoad() {
		this.pageSize = 10;
		this.appliedFilter  = [];

		let loading = this.loadingCtrl.create({ content: 'Espereu siusplau...' });
		loading.present();
		this.openData.loadMunicipis(loading)
		.catch((err) => { console.error('municipis(ionViewDidLoad) - Error: ' + err) });
	}

	/*	Apply Filter asking API */
	searchMunicipis(event:any) {
		let val = event.target.value;
		if (!val || val.trim() == '') return this.appliedFilter  = [];;

		this.openData.reduceFiltering(this.appliedFilter ,val).then((resultat: any) => {
			if (resultat[0] == undefined) {
				this.appliedFilter  = [];
				this.appliedFilter [0] = -1;
			}
			else this.appliedFilter  = resultat;
		}).catch((err) => {console.error('ERROR - searchMunicipis: ' + err['message'])});
	}

	/* Responsible for the infinite scroll */
	doInfinite(infiniteScroll) {
		if (this.appliedFilter [0] == undefined && this.appliedFilter [0] != -1 && this.pageSize < this.openData.municipisInfo.length) this.pageSize++;
		return infiniteScroll.complete();
	}

	/*	Navigation page of the selected municipality */
	goToMunicipiDetail(municipiData: any) {
		// go to the session detail page
    // and pass in the session data
    this.navCtrl.push(MunicipiDetailPage, {
      ine: municipiData.ine,
      municipi: municipiData
    });
	}
}
