import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DibaMunicipisApp } from './app.component';

import { MunicipisPage } from '../pages/municipis/municipis';
import { MunicipiDetailPage } from '../pages/municipi-detail/municipi-detail';
import { PoisPage } from '../pages/pois/pois';
import { ActivitiesPage } from '../pages/activities/activities';

import { MunicipisFilter } from '../pipes/municipis-filter';
import { FavouritesFilter } from '../pipes/favourites-filter';
import { MunicipiUniqueFilter} from '../pipes/municipi-unique-filter';

import { OpenData } from '../providers/open-data';

@NgModule({
  declarations: [
    DibaMunicipisApp,
    MunicipisPage,
    MunicipiDetailPage,
    PoisPage,
    ActivitiesPage,
    MunicipisFilter,
    FavouritesFilter,
    MunicipiUniqueFilter
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
    OpenData,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
