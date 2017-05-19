import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { ActivitiesListPage } from "../activities-list/activities-list";
import { ActivitiesMapPage } from "../activities-map/activities-map";

@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html'
})

export class ActivitiesPage {

  tab1Root = ActivitiesListPage;
  tab2Root = ActivitiesMapPage;
  mySelectedIndex: number;
  ine: string;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.ine = navParams.data.tabIndex || '';
  }

}
