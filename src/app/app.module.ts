import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';

import { DibaMunicipisApp } from './app.component';

import { MunicipisPage } from '../pages/municipis/municipis';
import { MunicipiDetailPage } from '../pages/municipi-detail/municipi-detail';
import { PoisPage } from '../pages/pois/pois';
import { ActivitiesPage } from '../pages/activities/activities';

import { MunicipisFilter } from '../pipes/municipis-filter';
import { FavouritesFilter } from '../pipes/favourites-filter';
import { MunicipiUniqueFilter} from '../pipes/municipi-unique-filter';

import { OpenData } from '../providers/open-data';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

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
    IonicModule.forRoot(DibaMunicipisApp),
    IonicStorageModule.forRoot(),
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
