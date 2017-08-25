import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

@IonicPage()
@Component({
  selector: 'page-transaction-detail',
  templateUrl: 'transaction-detail.html',
})
export class TransactionDetailPage {

	shoppingCart: Array<ShoppingItem> = [];
	date: string;
	store: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.shoppingCart = this.navParams.get('param1').cart;
  	this.store = this.navParams.get('param1').store;
  	this.date = (new Date(this.navParams.get('param1').date)).toDateString();
  }

  // calculates total price before tax
  private calculateTotalPrice() {
    var totalCost: number = 0;
    for(let item of this.shoppingCart) {
      totalCost += Number(item.quantity) * Number(item.price);
    }
    return totalCost.toFixed(2);
  }

  // calculates tax on total price
  private calculateTax() {
    return(Number(this.calculateTotalPrice()) * .06).toFixed(2);
  }

  // returns total price and tax combined
  private calculateFinalPrice() {
    return(Number(this.calculateTotalPrice()) + Number(this.calculateTax())).toFixed(2);
  }

  
}
