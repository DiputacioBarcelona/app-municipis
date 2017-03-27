import { Component, ViewChild } from '@angular/core';

import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage } from '../pages/home/home';
import { ActivitatsPage } from '../pages/activitats/activitats';
import { PuntsPage } from '../pages/punts/punts';

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

  rootPage: any = HomePage;

  appPages: PageInterface[];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {

    this.initializeApp();

    // List of pages that can be navigated to from the left menu
    this.appPages = [
      { title: 'Home', component: HomePage, icon: 'contacts' },
      { title: 'Activitats', component: ActivitatsPage, icon: 'calendar' },
      { title: 'Punts', component: PuntsPage, icon: 'map' }
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
