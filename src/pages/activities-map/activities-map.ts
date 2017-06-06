import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, Platform, Events } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, MarkerOptions, Marker/*, GoogleMapsAnimation, CameraPosition*/ } from '@ionic-native/google-maps';

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
  private ine;
  private lastIne = '';
  private queryText = '';
  private lastQueryText = '';
  private shownData: any = [];
  private iniDate: string;
  private fiDate: string;
  private category: string;
  private lastCategory = '';
  private excludedDatasetsNames: any = [];
  private lastExcludedDatasetsNames: any = [];
  private map: GoogleMap;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController, 
    public modalCtrl: ModalController,
    public paramsData: ParamsData,
    public openData: OpenData,
    public translate: TranslateService,
    public platform: Platform,
    public events: Events,
    private googleMaps: GoogleMaps
  ) {
    this.ine = paramsData.params.ine;
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
  }

  ionViewDidLoad() {    
    this.events.subscribe('menu:opened', () => {
      this.map.setClickable(false);
    });

    this.events.subscribe('menu:closed', () => {
      this.map.setClickable(true);
    });
	}

  loadMap() {
    // create a new map by passing HTMLElement
    let mapElement: HTMLElement = document.getElementById('map');

    // create LatLng object
    let location: LatLng = new LatLng(41.5777099,1.6122413); //Igualada

    let mapOptions = {
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
    };
 
    this.map = new GoogleMap(mapElement, mapOptions);

    /*this.map = new google.maps.Map(mapElement, mapOptions);*/

    /*google.maps.event.addListenerOnce(this.map, 'idle', () => {
 
        this.updateMap();
 
        google.maps.event.addListener(this.map, 'dragend', () => {
            this.updateMap();
        });
 
    });*/

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    this.map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker
        this.updateMap();
      }
    );

    /*this.map.one(GoogleMapsEvent.MY_LOCATION_CHANGE).then(
      () => {
        console.log('My location Change!');
        
        this.updateMap();
      }
    );*/

    this.map.one(GoogleMapsEvent.CAMERA_CHANGE).then(
      () => {
        console.log('Camera Change!');
        
        /*this.updateMap();*/
      }
    );

    this.map.one(GoogleMapsEvent.MY_LOCATION_BUTTON_CLICK).then(
      () => {
        console.log('My button click!');
        
       /* this.updateMap();*/
      }
    );

  }

  private getColor(dataset:string){
    if(dataset == 'actesparcs'){
      return '#891536';
    } else if(dataset == 'actesmuseus'){
      return '#8E8D93';
    } else if(dataset == 'escenari'){
      return '#FE4C52';
    } else if(dataset == 'actesbiblioteques_ca'){
      return '#FD8B2D';
    } else if(dataset == 'actesturisme_ca'){
      return '#FED035';
    }
  }

  updateMap() {

    return new Promise(resolve => {
      let msg = 'Espereu siusplau...';
      this.translate.get('APP.LOADING_MESSAGE').subscribe((res: string) => {
          msg = res;
      });
      
     /* let center = this.map.getCenter(),
        bounds = this.map.getBounds(),
        zoom = this.map.getZoom();*/

/*      let location = this.map.getCameraPosition();
      this.map.clear();*/

      console.log(location);

      let loading = this.loadingCtrl.create({ content: msg });
      loading.present();

      this.openData.getActivities(this.queryText, 1 , 2, 
                                  this.ine, this.iniDate, this.fiDate, this.category, this.excludedDatasetsNames)
      .subscribe((data: any) => {
        
        for(let activity of data) {
          /*this.data.push(elem);*/
          let coords: string = activity.grup_adreca.localitzacio;
          if(coords){
            let lat: number = +coords.split(',')[0];
            let lng: number = +coords.split(',')[1];
            let location: LatLng = new LatLng(lat,lng);

            let markerOptions: MarkerOptions = {
              position: location,              
              title: activity.titol,
              snippet: [activity.rel_municipis.municipi_nom, activity.rel_temes.tema_nom].join("\n"),
              icon: this.getColor(activity.dataset.machinename),
              infoClick: this.goToActivityDetail
            };

            const marker: any = this.map.addMarker(markerOptions)
              .then((marker: Marker) => {
                marker.showInfoWindow();
                marker.set('activity', activity);
                /*marker.setTitle("Teste");*/
            });
            
          }
          
        }
        this.lastQueryText = this.queryText;
        this.lastIne = this.ine;
        this.lastCategory = this.category;
        this.lastExcludedDatasetsNames =  this.excludedDatasetsNames;
        loading.dismiss();
        resolve(true);
      });
            
    });
  }

  goToActivityDetail(marker: any) {
    marker.hideInfoWindow();
    this.navCtrl.push(ActivitiesDetailPage, {
      activity: marker.get('activity')
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
