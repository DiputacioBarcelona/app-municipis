import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent } from '@ionic-native/google-maps';

import { ParamsData } from '../../providers/params-data';

@Component({
  selector: 'page-activities-map',
  templateUrl: 'activities-map.html'
})

export class ActivitiesMapPage {
  private ine;
  private map: GoogleMap;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public paramsData: ParamsData,
    private googleMaps: GoogleMaps
  ) {
    this.ine = paramsData.params.ine;
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
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

}
