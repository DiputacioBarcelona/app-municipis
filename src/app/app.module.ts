import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DibaMunicipisApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { MunicipiPage } from '../pages/municipi/municipi';
import { PuntsPage } from '../pages/punts/punts';
import { ActivitatsPage } from '../pages/activitats/activitats';

import { FiltraMunicipis } from '../pipes/filtra-municipis';
import { FiltraPreferits } from '../pipes/filtra-preferits';
import { FiltraUnicMunicipi} from '../pipes/filtra-unic-municipi';

import { RepositoriDadesObertes } from '../providers/dades-obertes';

@NgModule({
  declarations: [
    DibaMunicipisApp,
    HomePage,
    MunicipiPage,
    PuntsPage,
    ActivitatsPage,
    FiltraMunicipis,
    FiltraPreferits,
    FiltraUnicMunicipi
  ],
  imports: [
    IonicModule.forRoot(DibaMunicipisApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DibaMunicipisApp,
    HomePage,
    MunicipiPage,
    PuntsPage,
    ActivitatsPage
  ],
  providers: [
    RepositoriDadesObertes,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
