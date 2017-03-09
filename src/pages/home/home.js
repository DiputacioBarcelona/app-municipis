var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { DadesObertes } from '../../providers/dades-obertes';
import { MunicipiPage } from '../municipi/municipi';
var HomePage = (function () {
    function HomePage(navCtrl, doProvider, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.doProvider = doProvider;
        this.loadingCtrl = loadingCtrl;
        var options = {
            name: '__ionicstorage',
            backupFlag: SqlStorage.BACKUP_LOCAL,
            existingDatabase: false // load this as an existing database
        };
        var storage = new Storage(SqlStorage);
        // Inicialitzem parametres globals
        this.municipis = [];
        this.elemPaginacio = 50;
        this.filtreAplicat = false;
        // Iniciem el controlador de càrrega
        var loading = this.loadingCtrl.create({
            content: 'Espereu siusplau...'
        });
        // Mostrem per pantalla l'avís
        loading.present();
        // Definim el nombre d'elements per pàgina
        this.elemPaginacio = 50;
        // Recollim la info i tanquem l'avís al proveïdor, seguidament montem les dades per l'html
        this.doProvider.carregaHome(loading).then(function (data) { return _this.initializeMunicipis(); });
        /*
        A testejar amb el dispositiu conectat i seguint les instruccions de:
        https://forum.ionicframework.com/t/testing-your-application-on-real-devices/7122/6
        NativeStorage.setItem('municipis', this.municipis)
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );

        var test = NativeStorage.getItem('municipis')
  .then(
    data => console.log(data),
    error => console.error(error)
  );

    console.log(test);*/
    }
    // Carrega les estructures de dades de Municipis i MunicipisFiltrats
    HomePage.prototype.initializeMunicipis = function () {
        for (var i = 0; i < this.doProvider.municipisInfo['entitats']; ++i) {
            this.municipis.push({
                nom: this.doProvider.municipisInfo['elements'][i]['municipi_nom'],
                comarca: this.doProvider.municipisInfo['elements'][i]['grup_comarca']['comarca_nom'],
                escut: this.doProvider.municipisInfo['elements'][i]['municipi_escut'],
                preferit: false
            });
        }
        this.initializeItemsFiltrats();
    };
    // Carrega les estructures de dades de municipisFiltrats
    HomePage.prototype.initializeItemsFiltrats = function () {
        this.municipisFiltrats = [];
        for (var i = 0; i < this.elemPaginacio; ++i) {
            this.municipisFiltrats.push(this.municipis[i]);
        }
    };
    // Aplica el filtre preguntant a la API
    HomePage.prototype.filtraMunicipis = function (event) {
        var _this = this;
        // Recollim el valor introduït al cercador
        var val = event.target.value;
        // En el cas que es trobi buida la cerca retornem tots els municipis
        if (!val || val.trim() == '') {
            this.filtreAplicat = false;
            return this.initializeItemsFiltrats();
        }
        // Perque no continui paginant un cop es faci scroll sobre els resultats
        this.filtreAplicat = true;
        // Preguntem a la API
        var filtratsIndex = [];
        this.doProvider.redueixFiltrats(val, filtratsIndex).then(function (carrega) {
            _this.municipisFiltrats = [];
            filtratsIndex = filtratsIndex.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            }).sort();
            for (var i = 0; i <= filtratsIndex.length - 1; i++) {
                _this.municipisFiltrats.push(_this.municipis[filtratsIndex[i]]);
            }
        });
    };
    // S'encarrega de montar l'scroll infinit
    HomePage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        if (this.municipisFiltrats.length == this.municipis.length || this.filtreAplicat)
            return infiniteScroll.complete();
        setTimeout(function () {
            var ini = _this.municipisFiltrats.length;
            var fi = ini + _this.elemPaginacio > _this.municipis.length ? _this.municipis.length : ini + _this.elemPaginacio;
            for (ini; ini < fi; ini++) {
                _this.municipisFiltrats.push(_this.municipis[ini]);
            }
            infiniteScroll.complete();
        }, 500);
    };
    // Navegació a la pàgina pròpia d'un municipi seleccionat
    HomePage.prototype.seleccionaMunicipi = function (nom, preferit) {
        this.navCtrl.push(MunicipiPage, { nom: nom, preferit: preferit });
    };
    return HomePage;
}());
HomePage = __decorate([
    Component({
        selector: 'page-home',
        templateUrl: 'home.html',
        providers: [DadesObertes]
    }),
    __metadata("design:paramtypes", [NavController, DadesObertes, LoadingController])
], HomePage);
export { HomePage };
//# sourceMappingURL=home.js.map