import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';
import { RepositoriDadesObertes } from '../../providers/dades-obertes';
import { MunicipiPage } from '../municipi-detail/municipi-detail';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	public paginacio: number;
	public filtreAplicat: number[];

	constructor(public navCtrl: NavController, public doProvider: RepositoriDadesObertes, public loadingCtrl: LoadingController) {}

	/*	S'executa quan la pagina s'ha carregat. Nomes s'executa una vegada per pagina creada. */
	ionViewDidLoad() {
		this.paginacio = 10;
		this.filtreAplicat = [];

		let loading = this.loadingCtrl.create({ content: 'Espereu siusplau...' });
		loading.present();
		this.doProvider.carregaMunicipis(loading)
		.catch((err) => { console.log('home(ionViewDidLoad) - Error: ' + err) });
	}

	/*	Aplica el filtre preguntant a la API */
	cercaMunicipis(event:any) {
		let val = event.target.value;
		if (!val || val.trim() == '') return this.filtreAplicat = [];;

		this.doProvider.redueixFiltrats(this.filtreAplicat,val).then((resultat: any) => {
			if (resultat[0] == undefined) {
				this.filtreAplicat = [];
				this.filtreAplicat[0] = -1;
			}
			else this.filtreAplicat = resultat;
		}).catch((err) => {console.log('ERROR - cercaMunicipis: ' + err['message'])});
	}

	/*	S'encarrega de montar l'scroll infinit */
	doInfinite(infiniteScroll) {
		if (this.filtreAplicat[0] == undefined && this.filtreAplicat[0] != -1 && this.paginacio < this.doProvider.municipisInfo.length) this.paginacio++;
		return infiniteScroll.complete();
	}

	/*	Navegació a la pàgina pròpia d'un municipi seleccionat */
	entraPaginaMunicipi(ine: string) {
		this.navCtrl.push(MunicipiPage,{ine : ine});
	}

	/*	Guarda a la BD el canvi d'estat de preferit d'un municipi */
	canviaPreferit(ine: string) {
		this.doProvider.canviaPreferit(ine);
	}
}
