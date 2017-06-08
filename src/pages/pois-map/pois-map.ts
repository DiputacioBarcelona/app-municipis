import { Component } from '@angular/core';
import { NavController, ModalController, Platform, Events } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, MarkerOptions, Marker, CameraPosition } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { TranslateService } from 'ng2-translate/ng2-translate'

import { PoisFilterPage } from '../pois-filter/pois-filter';
import { PoisDetailPage } from '../pois-detail/pois-detail';

import { OpenData } from '../../providers/open-data';
import { ParamsData } from '../../providers/params-data';

@Component({
  selector: 'page-pois-map',
  templateUrl: 'pois-map.html'
})

export class PoisMapPage {
  private ine;
  private lastIne = '';
  private queryText = '';
  private lastQueryText = '';
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
    if(dataset == 'parcsequipaments_ca'){
      return '#891536';
    } else if(dataset == 'puntesports'){
      return '#8E8D93';
    } else if(dataset == 'museus'){
      return '#FE4C52';
    } else if(dataset == 'espaisescenics'){
      return '#FD8B2D';
    } else if(dataset == 'biblioteques'){
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
      
      this.openData.getPois(this.queryText, 1 , 10, 
                                    this.ine, this.category, this.excludedDatasetsNames, center)
        .subscribe((data: any) => {
          for(let poi of data) {
            if(!this.markerExists(poi.punt_id)){
              let coords: string = poi.localitzacio;
              if(coords){
                let lat: number = +coords.split(',')[0];
                let lng: number = +coords.split(',')[1];
                let location: LatLng = new LatLng(lat,lng);

                let markerOptions: MarkerOptions = {
                  position: location,              
                  title: poi.adreca_nom,
                  snippet: [poi.rel_municipis.municipi_nom, poi.rel_temes.tema_nom].join("\n"),
                  icon: this.getColor(poi.dataset.machinename)
                };

                const marker: any = this.map.addMarker(markerOptions)
                  .then((marker: Marker) => {
                    marker.set('poi', poi);
                    marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe((data) => {
                          this.navCtrl.push(PoisDetailPage, {
                            poi: poi
                          });
                        }
                    );
                });
                this.markers.push(poi.punt_id);
              }
            }
          }
          /*alert(this.markers.length);*/
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
    let modal = this.modalCtrl.create(PoisFilterPage, {
      ine: this.ine,
      category: this.category,
      excludedDatasetsNames: this.excludedDatasetsNames
    });
    modal.present();

    modal.onWillDismiss((data: any) => {
      this.map.setClickable(true);
      if (data) {
        this.ine = data.ine;
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

  private markerExists(punt_id: any){
    let exists = false;
 
    this.markers.forEach((id) => {
        if(id === punt_id){
            exists = true;
        }
    });
 
    return exists;
  }

}
