import { Component, ViewChild } from '@angular/core';

import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {TranslateService} from 'ng2-translate';

import { MunicipisPage } from '../pages/municipis/municipis';
import { ActivitiesPage } from '../pages/activities/activities';
import { PoisPage } from '../pages/pois/pois';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
}

@Component({
  templateUrl: 'app.html'
})

export class DibaMunicipisApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MunicipisPage;

  appPages: PageInterface[];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public translate: TranslateService) {

    this.initializeApp();

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // List of pages that can be navigated to from the left menu
    this.appPages = [
      { title: 'Municipis', component: MunicipisPage, icon: 'contacts' },
      { title: 'Activitats', component: ActivitiesPage, icon: 'calendar' },
      { title: 'Punts', component: PoisPage, icon: 'map' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
