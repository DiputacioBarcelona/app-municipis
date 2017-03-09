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
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { DadesObertes } from '../../providers/dades-obertes';
/*
  Generated class for the Municipi page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var MunicipiPage = (function () {
    function MunicipiPage(navCtrl, navParams, doProvider, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.doProvider = doProvider;
        this.loadingCtrl = loadingCtrl;
        this.nom = navParams.get('nom');
        this.preferit = navParams.get('preferit');
        var loading = this.loadingCtrl.create({
            content: 'Espereu siusplau...'
        });
        loading.present();
        this.doProvider.carregaMunicipi(loading, this.nom).then(function (data) { return _this.getInfo(); });
    }
    MunicipiPage.prototype.getInfo = function () {
        this.escut = this.doProvider.municipiSel['elements'][0]['municipi_escut'];
        this.ine = this.doProvider.municipiSel['elements'][0]['ine'];
        this.cif = this.doProvider.municipiSel['elements'][0]['grup_ajuntament']['cif'];
        this.provincia = this.doProvider.municipiSel['elements'][0]['grup_provincia']['provincia_nom'];
        this.comarca = this.doProvider.municipiSel['elements'][0]['grup_comarca']['comarca_nom'];
        this.adreca = this.doProvider.municipiSel['elements'][0]['grup_ajuntament']['adreca'];
        this.email = this.doProvider.municipiSel['elements'][0]['grup_ajuntament']['email'];
        this.telf = this.doProvider.municipiSel['elements'][0]['grup_ajuntament']['telefon_contacte'];
        this.fax = this.doProvider.municipiSel['elements'][0]['grup_ajuntament']['fax'];
        this.coords = this.doProvider.municipiSel['elements'][0]['grup_ajuntament']['localitzacio'];
        this.bandera = this.doProvider.municipiSel['elements'][0]['municipi_bandera'];
        this.vista = this.doProvider.municipiSel['elements'][0]['municipi_vista'];
    };
    return MunicipiPage;
}());
MunicipiPage = __decorate([
    Component({
        selector: 'page-municipi',
        templateUrl: 'municipi.html',
        providers: [DadesObertes]
    }),
    __metadata("design:paramtypes", [NavController, NavParams, DadesObertes, LoadingController])
], MunicipiPage);
export { MunicipiPage };
//# sourceMappingURL=municipi.js.map