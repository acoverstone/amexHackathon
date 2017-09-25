import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import 'rxjs/add/operator/map';


@Injectable()
export class UpcProvider {

  	constructor(public http: Http, public db: AngularFireDatabase) { }

  	getItems() {

	    return this.db.list('/items/' , {preserveSnapshot:true});

  	}

}
