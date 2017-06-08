import 'intl';
import 'intl/locale-data/jsonp/en';

import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';

import { IonicStorageModule } from '@ionic/storage';

import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';

import { DibaMunicipisApp } from './app.component';

import { MunicipisPage } from '../pages/municipis/municipis';
import { MunicipisDetailPage } from '../pages/municipis-detail/municipis-detail';
import { PoisPage } from '../pages/pois/pois';
import { PoisDetailPage } from '../pages/pois-detail/pois-detail';
import { PoisFilterPage } from '../pages/pois-filter/pois-filter';
import { PoisListPage } from '../pages/pois-list/pois-list';
import { PoisMapPage } from '../pages/pois-map/pois-map';
import { ActivitiesPage } from '../pages/activities/activities';
import { ActivitiesDetailPage } from '../pages/activities-detail/activities-detail';
import { ActivitiesFilterPage } from '../pages/activities-filter/activities-filter';
import { ActivitiesListPage } from '../pages/activities-list/activities-list';
import { ActivitiesMapPage } from '../pages/activities-map/activities-map';

import { DateFormat } from '../pipes/date-format';

import { OpenData } from '../providers/open-data';
import { UserData } from '../providers/user-data';
import { ParamsData } from '../providers/params-data';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
  declarations: [
    DibaMunicipisApp,
    MunicipisPage,
    MunicipisDetailPage,
    PoisPage,
    PoisDetailPage,
    PoisFilterPage,
    PoisListPage,
    PoisMapPage,
    ActivitiesPage,
    ActivitiesDetailPage,
    ActivitiesFilterPage,
    ActivitiesListPage,
    ActivitiesMapPage,
    DateFormat
  ],
  imports: [
    IonicModule.forRoot(DibaMunicipisApp, {
      backButtonText: ''
    }),
    IonicStorageModule.forRoot({
      name: '__mesmunicipisdb'
    }),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DibaMunicipisApp,
    MunicipisPage,
    MunicipisDetailPage,
    PoisPage,
    PoisDetailPage,
    PoisFilterPage,
    PoisListPage,
    PoisMapPage,
    ActivitiesPage,
    ActivitiesDetailPage,
    ActivitiesFilterPage,
    ActivitiesListPage,
    ActivitiesMapPage
  ],
  providers: [
    OpenData,
    UserData,
    ParamsData,
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
