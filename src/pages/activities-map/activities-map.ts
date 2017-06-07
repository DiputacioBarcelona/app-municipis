import { Component } from '@angular/core';
import { NavController, ModalController, Platform, Events } from 'ionic-angular';
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

    this.events.subscribe('marker:onInfoClick', () => {
      console.log('event!! ---- marker:onInfoClick');
    });
	}

  loadMap() {
    let mapElement: HTMLElement = document.getElementById('map');

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

    this.map.on(GoogleMapsEvent.CAMERA_CHANGE).subscribe((data: any) => {             
        this.updateMap();
    });

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
      
     /* let center = this.map.getCenter(),
        bounds = this.map.getBounds(),
        zoom = this.map.getZoom();*/

/*      let location = this.map.getCameraPosition();
      this.map.clear();*/

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
              icon: this.getColor(activity.dataset.machinename)
            };

            const marker: any = this.map.addMarker(markerOptions)
              .then((marker: Marker) => {
                marker.set('activity', activity);
                marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe((data) => {
                      this.navCtrl.push(ActivitiesDetailPage, {
                        activity: activity
                      });
                    }
                );
            });
            
          }
          
        }
        this.lastQueryText = this.queryText;
        this.lastIne = this.ine;
        this.lastCategory = this.category;
        this.lastExcludedDatasetsNames =  this.excludedDatasetsNames;        
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
