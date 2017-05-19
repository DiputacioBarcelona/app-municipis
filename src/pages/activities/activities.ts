import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { ActivitiesListPage } from "../activities-list/activities-list";
import { ActivitiesMapPage } from "../activities-map/activities-map";

import { ParamsData } from '../../providers/params-data';

@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html'
})

export class ActivitiesPage {
  tab1Root = ActivitiesListPage;
  tab2Root = ActivitiesMapPage;
  mySelectedIndex: number;
  ine: string;

  constructor(
    navParams: NavParams,
    public paramsData: ParamsData
  ) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.ine = navParams.data.ine || '';
    paramsData.params = {'ine' : this.ine};
  }

}
