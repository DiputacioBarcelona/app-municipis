import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DibaMunicipisApp } from './app.component';

import { MunicipisPage } from '../pages/municipis/municipis';
import { MunicipiDetailPage } from '../pages/municipi-detail/municipi-detail';
import { PoisPage } from '../pages/pois/pois';
import { ActivitiesPage } from '../pages/activities/activities';

import { FiltraMunicipis } from '../pipes/filtra-municipis';
import { FiltraPreferits } from '../pipes/filtra-preferits';
import { FiltraUnicMunicipi} from '../pipes/filtra-unic-municipi';

import { RepositoriDadesObertes } from '../providers/dades-obertes';

@NgModule({
  declarations: [
    DibaMunicipisApp,
    MunicipisPage,
    MunicipiDetailPage,
    PoisPage,
    ActivitiesPage,
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
    MunicipisPage,
    MunicipiDetailPage,
    PoisPage,
    ActivitiesPage
  ],
  providers: [
    RepositoriDadesObertes,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
