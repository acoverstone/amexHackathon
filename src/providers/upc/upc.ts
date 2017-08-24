import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class UpcProvider {

  constructor(public http: Http) { }

  getItem(upcCode: string) {
  	return this.http.get("http://api.upcdatabase.org/json/37ea40b6dad5957e6e6e01c8cecd8eb6/0" + upcCode).map(res => res.json());
  }

}
