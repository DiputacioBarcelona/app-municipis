import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { RepositoriDadesObertes } from '../providers/dades-obertes';
import { HomePage } from '../pages/home/home';
import { MunicipiPage } from '../pages/municipi/municipi';
import { PuntsPage } from '../pages/punts/punts';
import { ActivitatsPage } from '../pages/activitats/activitats';
import { FiltraMunicipis } from '../pipes/filtra-municipis';
import { FiltraPreferits } from '../pipes/filtra-preferits';
import { FiltraUnicMunicipi} from '../pipes/filtra-unic-municipi';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MunicipiPage,
    PuntsPage,
    ActivitatsPage,
    FiltraMunicipis,
    FiltraPreferits,
    FiltraUnicMunicipi
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MunicipiPage,
    PuntsPage,
    ActivitatsPage
  ],
  providers: [ RepositoriDadesObertes ]
})
export class AppModule {}
