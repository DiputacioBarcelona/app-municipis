import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

import { ParamsData } from '../../providers/params-data';

@Component({
  selector: 'page-activities-map',
  templateUrl: 'activities-map.html'
})

export class ActivitiesMapPage {
  private ine;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public paramsData: ParamsData
  ) {
    this.ine = paramsData.params.ine;
  }

}
