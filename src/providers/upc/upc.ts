import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the UpcProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UpcProvider {

  constructor(public http: Http) { }

  getItem(upcCode: string) {
  	return this.http.get("http://api.upcdatabase.org/json/37ea40b6dad5957e6e6e01c8cecd8eb6/0" + upcCode).map(res => res.json());
  }

}
