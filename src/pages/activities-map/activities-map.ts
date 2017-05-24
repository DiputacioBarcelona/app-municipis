import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, Platform } from 'ionic-angular';
/*import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng } from 'ionic-native';*/
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';

import { TranslateService } from 'ng2-translate/ng2-translate'

import { ActivitiesFilterPage } from '../activities-filter/activities-filter';
import { ActivitiesDetailPage } from '../activities-detail/activities-detail';

import { OpenData } from '../../providers/open-data';
import { ParamsData } from '../../providers/params-data';

@Component({
  selector: 'page-activities-map',
  templateUrl: 'activities-map.html'
})

export class ActivitiesMapPage {
  private map: GoogleMap;
  private ine;
  private lastIne = '';
  private queryText = '';
  private lastQueryText = '';
	private data: any = [];
  private shownData: any = [];
  private total: number;
  private iniDate: string;
  private fiDate: string;
  private category: string;
  private lastCategory = '';
  private excludedDatasetsNames: any = [];
  private lastExcludedDatasetsNames: any = [];

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController, 
    public modalCtrl: ModalController,
    public paramsData: ParamsData,
    public openData: OpenData,
    public translate: TranslateService,
    public platform: Platform
  ) {
    this.ine = paramsData.params.ine;
    platform.ready().then(() => {
            this.loadMap();
    });
  }

  ionViewDidLoad() {
    this.updateMap();
	}

  loadMap() {

    let location = new LatLng(41.5777099,1.6122413); //Igualada
 
    this.map = new GoogleMap('map', {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': location,
        'tilt': 30,
        'zoom': 15,
        'bearing': 50
      }
    });

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
        console.log('Map is ready!');
    });
  }

  updateMap() {

    return new Promise(resolve => {
      let msg = 'Espereu siusplau...';
      this.translate.get('MUNICIPIS.LOADING_MESSAGE').subscribe((res: string) => {
          msg = res;
      });

      let location = new LatLng(41.5777099,1.6122413); //Igualada

      let loading = this.loadingCtrl.create({ content: msg });
      loading.present();

      this.openData.getActivities(this.queryText, 0 , 1, 
                                  this.ine, this.iniDate, this.fiDate, this.category, this.excludedDatasetsNames)
      .subscribe((data: any) => {
        for(let elem of data) {
          this.data.push(elem);

          // create new marker
          let markerOptions: MarkerOptions = {
            position: location,
            title: 'Ionic'
          };

          const marker: any = this.map.addMarker(markerOptions)
            .then((marker: Marker) => {
                marker.showInfoWindow();
          });

        }
        this.shownData = this.data.length;
        this.total = data.entitats;
        this.lastQueryText = this.queryText;
        this.lastIne = this.ine;
        this.lastCategory = this.category;
        this.lastExcludedDatasetsNames =  this.excludedDatasetsNames;
        loading.dismiss();
        resolve(true);
      });
            
    });
  }

  presentFilter() {
    this.map.setClickable(false);
    let modal = this.modalCtrl.create(ActivitiesFilterPage, {
      ine: this.ine,
      iniDate: this.iniDate,
      fiDate: this.fiDate,
      category: this.category,
      excludedDatasetsNames: this.excludedDatasetsNames
    });
    modal.present();

    modal.onWillDismiss((data: any) => {
      this.map.setClickable(true);
      if (data) {
        this.ine = data.ine;
        this.iniDate = data.iniDate;
        this.fiDate = data.fiDate;
        this.category = data.category;
        this.excludedDatasetsNames = data.excludedDatasetsNames;
        this.updateMap();
      }
    });
  }

}
