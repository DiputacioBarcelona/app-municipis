var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
var DadesObertes = (function () {
    function DadesObertes(http) {
        this.http = http;
        this.IndexMunicipis = {};
    }
    // Carrega les dades de tots els municipis des de la API
    DadesObertes.prototype.carregaHome = function (loading) {
        var _this = this;
        if (this.municipisInfo) {
            return Promise.resolve(this.municipisInfo);
        }
        // Dont have the data yet
        return new Promise(function (resolve) {
            _this.http.get('http://do.diba.cat/api/dataset/municipis/format/JSON/ord-municipi_nom/')
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                setTimeout(function () {
                    _this.municipisInfo = data;
                    resolve(_this.municipisInfo);
                    loading.dismiss();
                }, 1000);
            });
            (function (err) { return console.error(err); });
        }).then(function (inicialitzaIndex) {
            for (var i = 0; i < _this.municipisInfo['entitats']; ++i) {
                _this.IndexMunicipis[_this.municipisInfo['elements'][i]['municipi_nom']] = i;
            }
        });
    };
    // Carrega les dades d'un municipi en concret des de la API
    DadesObertes.prototype.carregaMunicipi = function (loading, nom) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get('http://do.diba.cat/api/dataset/municipis/format/JSON/camp-municipi_nom/' + nom)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.municipiSel = data;
                resolve(_this.municipiSel);
                loading.dismiss();
            });
            (function (err) { return console.error(err); });
        });
    };
    // Consulta municipis i comarques a la API
    DadesObertes.prototype.redueixFiltrats = function (val, filtrats) {
        var _this = this;
        var munFil;
        var comFil;
        return new Promise(function (resolve) {
            _this.http.get('http://do.diba.cat/api/dataset/municipis/format/JSON/ord-municipi_nom/camp-municipi_nom-like/' + val)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                munFil = data;
                resolve(munFil);
            });
            (function (err) { return console.error(err); });
        }).then(function (crida) { return new Promise(function (resolve) {
            _this.http.get('http://do.diba.cat/api/dataset/municipis/format/JSON/ord-municipi_nom/camp-comarca_nom-like/' + val)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                comFil = data;
                resolve(comFil);
            });
            (function (err) { return console.error(err); });
        }); }).then(function (construeixFiltres) {
            for (var i = 0; i < munFil['entitats']; i++) {
                filtrats.push(_this.IndexMunicipis[munFil['elements'][i]['municipi_nom']]);
            }
            for (var i = 0; i < comFil['entitats']; i++) {
                filtrats.push(_this.IndexMunicipis[comFil['elements'][i]['municipi_nom']]);
            }
        });
    };
    return DadesObertes;
}());
DadesObertes = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], DadesObertes);
export { DadesObertes };
//# sourceMappingURL=dades-obertes.js.map