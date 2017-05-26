import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { PoisListPage } from "../pois-list/pois-list";
import { PoisMapPage } from "../pois-map/pois-map";

import { ParamsData } from '../../providers/params-data';

@Component({
  selector: 'page-pois',
  templateUrl: 'pois.html'
})

export class PoisPage {
  private tab1Root = PoisListPage;
  private tab2Root = PoisMapPage;
  private mySelectedIndex: number;
  private ine: string;

  constructor(
    public navParams: NavParams,
    public paramsData: ParamsData
  ) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.ine = navParams.data.ine || '';
    paramsData.params = {'ine' : this.ine};
  }

}
