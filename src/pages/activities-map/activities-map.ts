import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent } from '@ionic-native/google-maps';

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
    private googleMaps: GoogleMaps,
    public translate: TranslateService
  ) {
    this.ine = paramsData.params.ine;
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
  }

  ionViewDidLoad() {
    this.updateMap();
	}

  loadMap() {

    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    this.map = this.googleMaps.create(element);

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    this.map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker
      }
    );

    /*// create LatLng object
    let ionic: LatLng = new LatLng(43.0741904,-89.3809802);

    // create CameraPosition
    let position: CameraPosition = {
      target: ionic,
      zoom: 18,
      tilt: 30
    };

    // move the map's camera to position
    map.moveCamera(position);

    // create new marker
    let markerOptions: MarkerOptions = {
      position: ionic,
      title: 'Ionic'
    };

    const marker: Marker = map.addMarker(markerOptions)
      .then((marker: Marker) => {
          marker.showInfoWindow();
        });*/
  }

  updateMap() {

    return new Promise(resolve => {
      let msg = 'Espereu siusplau...';
      this.translate.get('MUNICIPIS.LOADING_MESSAGE').subscribe((res: string) => {
          msg = res;
      });

      let loading = this.loadingCtrl.create({ content: msg });
      loading.present();

      /*if (this.lastQueryText != this.queryText || this.lastIne != this.ine 
          || this.lastCategory != this.category  || this.lastExcludedDatasetsNames != this.excludedDatasetsNames) {
        this.start = 1;
        this.data = [];
      }*/

      this.openData.getActivities(this.queryText, 0 , 10, 
                                  this.ine, this.iniDate, this.fiDate, this.category, this.excludedDatasetsNames)
      .subscribe((data: any) => {
        for(let elem of data) {
          this.data.push(elem);
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
    let modal = this.modalCtrl.create(ActivitiesFilterPage, {
      ine: this.ine,
      iniDate: this.iniDate,
      fiDate: this.fiDate,
      category: this.category,
      excludedDatasetsNames: this.excludedDatasetsNames
    });
    modal.present();

    modal.onWillDismiss((data: any) => {
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
