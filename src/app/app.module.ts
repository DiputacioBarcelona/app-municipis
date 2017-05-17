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

import { OpenData } from '../providers/open-data';
import { UserData } from '../providers/user-data';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
  declarations: [
    DibaMunicipisApp,
    MunicipisPage,
    MunicipiDetailPage,
    PoisPage,
    ActivitiesPage
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
    MunicipiDetailPage,
    PoisPage,
    ActivitiesPage
  ],
  providers: [
    OpenData,
    UserData,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
