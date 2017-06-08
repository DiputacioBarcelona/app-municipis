import { Component } from '@angular/core';
import { NavController, ModalController, Platform, Events } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, MarkerOptions, Marker, CameraPosition } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

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
  private markers: any = [];

  constructor(
    public navCtrl: NavController,    
    public modalCtrl: ModalController,
    public paramsData: ParamsData,
    public openData: OpenData,
    public translate: TranslateService,
    public platform: Platform,
    public events: Events,
    private googleMaps: GoogleMaps,
    private geolocation: Geolocation
  ) {
    this.ine = paramsData.params.ine;
    this.iniDate = this.convertDate(new Date());
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
	}

  private loadMap() {
    let mapElement: HTMLElement = document.getElementById('map');
    let center: LatLng = new LatLng(41.5777099,1.6122413); //Igualada
    let mapOptions = {
        'backgroundColor': 'white',
        'controls': {
          'compass': true,
          'myLocationButton': true,
          'indoorPicker': true,
          'zoom': true // Only for Android
        },
        'gestures': {
          'scroll': true,
          'tilt': true,
          'rotate': true,
          'zoom': true
        },
        'camera': {
          'latLng': center,
          'tilt': 30,
          'zoom': 9,
          'bearing': 50
        }
      };
  
      this.map = new GoogleMap(mapElement, mapOptions);

      this.map.one(GoogleMapsEvent.MAP_READY).then(
        () => {
          console.log('Map is ready!');
          
          this.geolocation.getCurrentPosition().then((resp) => {
            let center: LatLng = new LatLng(resp.coords.latitude,resp.coords.longitude);
            this.map.setCenter(center);

          }).catch((error) => {
            console.log('Error getting location', error);
          });
        }
      );

      this.map.on(GoogleMapsEvent.CAMERA_CHANGE).subscribe((data: any) => {             
        this.map.getCameraPosition().then(cameraPosition => {
          let target = JSON.stringify(cameraPosition.target);
          let temp = JSON.parse(target);
          let currentLatitude = temp.lat;
          let currentLongitude = temp.lng;      
          
          let coords: string = currentLatitude+','+currentLongitude;

          this.updateMap(coords);
        }) 
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

  private updateMap(center: string) {

    return new Promise(resolve => {

      if (this.lastQueryText != this.queryText || this.lastIne != this.ine 
          || this.lastCategory != this.category  || this.lastExcludedDatasetsNames != this.excludedDatasetsNames) {
        this.map.clear();
        this.markers = [];
      }
      
      this.openData.getActivities(this.queryText, 1 , 10, 
                                    this.ine, this.iniDate, this.fiDate, this.category, this.excludedDatasetsNames, center)
        .subscribe((data: any) => {
          for(let activity of data) {
            if(!this.markerExists(activity.acte_id)){
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
                this.markers.push(activity.acte_id);
              }
            }
          }
          alert(this.markers.length);
          this.lastQueryText = this.queryText;
          this.lastIne = this.ine;
          this.lastCategory = this.category;
          this.lastExcludedDatasetsNames =  this.excludedDatasetsNames;        
          resolve(true);
      });
    });
  }

  private presentFilter() {
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
       
        this.map.getCameraPosition().then(cameraPosition => {
          let target = JSON.stringify(cameraPosition.target);
          let temp = JSON.parse(target);
          let currentLatitude = temp.lat;
          let currentLongitude = temp.lng;      
          
          let coords: string = currentLatitude+','+currentLongitude;

          this.updateMap(coords);
        })
      }
    });
  }

  private markerExists(acte_id: any){
    let exists = false;
 
    this.markers.forEach((id) => {
        if(id === acte_id){
            exists = true;
        }
    });
 
    return exists;
  }

  private  convertDate(date: Date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString();
    var dd  = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
  }

}
