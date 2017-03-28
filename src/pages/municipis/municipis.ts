import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';

import { MunicipiDetailPage } from '../municipi-detail/municipi-detail';

import { OpenData } from '../../providers/open-data';

@Component({
	selector: 'page-home',
	templateUrl: 'municipis.html'
})

export class MunicipisPage {
	public paginacio: number;
	public filtreAplicat: number[];

	constructor(public navCtrl: NavController, public openData: OpenData, public loadingCtrl: LoadingController) {}

	/*	Executed when the page is loaded. Only runs once per page created. */
	ionViewDidLoad() {
		this.paginacio = 10;
		this.filtreAplicat = [];

		let loading = this.loadingCtrl.create({ content: 'Espereu siusplau...' });
		loading.present();
		this.openData.loadMunicipis(loading)
		.catch((err) => { console.log('home(ionViewDidLoad) - Error: ' + err) });
	}

	/*	Apply Filter asking API */
	cercaMunicipis(event:any) {
		let val = event.target.value;
		if (!val || val.trim() == '') return this.filtreAplicat = [];;

		this.openData.reduceFiltering(this.filtreAplicat,val).then((resultat: any) => {
			if (resultat[0] == undefined) {
				this.filtreAplicat = [];
				this.filtreAplicat[0] = -1;
			}
			else this.filtreAplicat = resultat;
		}).catch((err) => {console.log('ERROR - cercaMunicipis: ' + err['message'])});
	}

	/* Responsible for the infinite scroll */
	doInfinite(infiniteScroll) {
		if (this.filtreAplicat[0] == undefined && this.filtreAplicat[0] != -1 && this.paginacio < this.openData.municipisInfo.length) this.paginacio++;
		return infiniteScroll.complete();
	}

	/*	Navigation page of the selected municipality */
	entraPaginaMunicipi(ine: string) {
		this.navCtrl.push(MunicipiDetailPage,{ine : ine});
	}

	/*	Save the change BD preferred status of a municipality */
	canviaPreferit(ine: string) {
		this.openData.toggleFavourite(ine);
	}
}
