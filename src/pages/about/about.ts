import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { TransactionDetailPage } from '../../pages/transaction-detail/transaction-detail'


class ShoppingItem {
	name: string
  quantity: number
	price: string

	constructor(name: string, price: string) {
		this.name = name
    this.quantity = 1

    // this is for testing, firgure out better way to handle mssing price
    if(price == "") 
      this.price = "0.99";
    else 
		  this.price = price;
	}

  public increaseQuantity() {
    this.quantity += 1;
  }

  public decreaseQuantity() {
    this.quantity -= 1;
  }
}

class Transaction {
  date: number
  store: string
  cart: Array<ShoppingItem>

  constructor() {
    this.date = new Date().getTime();
  }
}

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

	data: FirebaseListObservable<any>;
	transactions: Array<Transaction> = [];

  constructor(public navCtrl: NavController, public db: AngularFireDatabase) {
  	this.transactions.splice(0, this.transactions.length);
  	this.data = db.list('/transactions', {preserveSnapshot:true});
  	
  	this.data.subscribe(snapshot => {

			snapshot.forEach(snapshot => {
	      this.transactions.unshift(snapshot.val()); 
	    });

    });
  	
  }

  private displayDate(timestamp: number) {
  	var date: Date = new Date(timestamp);
  	return date.toDateString();
  }

  private openDetailPage(i: number) {
  	this.navCtrl.push(TransactionDetailPage, {
  		param1: this.transactions[i]
  	});
  }

}
