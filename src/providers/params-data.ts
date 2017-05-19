import { Injectable } from '@angular/core';

@Injectable()
export class ParamsData {
  public params;

  constructor () {
    this.params = {};
  }
}
