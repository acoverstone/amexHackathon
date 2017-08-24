import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { UpcProvider } from './../../providers/upc/upc';

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
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
	data: Observable<any>;
  shoppingCart: Array<ShoppingItem> = [];
  selectedStore: string = "";

  constructor(public navCtrl: NavController, public db: AngularFireDatabase, private scanner: BarcodeScanner, private upcProvider: UpcProvider, private alertCtrl: AlertController, public http: Http) {
    
  }

  public scanPhoto() {

    if(this.selectedStore != ""){


      // For testing in browswer
      this.data = this.upcProvider.getItem("073430005044");

      this.data.subscribe(
        value => this.addItemToCart(value.itemname, value.avg_price)
      );

      // For use on the phone
    	// this.scanner.scan().then((barcodeData) => {

    	// 	// if the user cancels the action
     //    if (barcodeData.cancelled) {
     //      console.log("User cancelled the action!");
     //      return false;
     //    }

     //    this.data = this.upcProvider.getItem(barcodeData.text);
     //    this.data.subscribe(
     //      value => this.addItemToCart(value.itemname, value.avg_price)
     //    );

     //  }, (err) => {
     //    console.log(err);
     //  });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Select A Store',
        subTitle: 'Please select a store from the dropdown before scanning items.',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }

  // if item exists in cart increase quantity, otherwise add it to list
  private addItemToCart(name: string, cost: string) {
    if(this.checkItemInCart(name) != -1) {
      this.shoppingCart[this.checkItemInCart(name)].increaseQuantity();
    }
    else {
      this.shoppingCart.push(new ShoppingItem(name, cost));
    }
  }

  // remove item from cart, if quantity > 1 reduce, otherwise remove item
  private removeItemFromCart(name: string) {
    var index: number = this.checkItemInCart(name);
    if(this.shoppingCart[index].quantity > 1) {
      this.shoppingCart[index].decreaseQuantity();
    } else {
      this.shoppingCart.splice(index, 1);
    }
  }

  // clears all items out of the cart
  private clearCart() {
    for(let i in this.shoppingCart) {
      this.shoppingCart.splice(Number(i), 1);
    }
  }

  // returns index if specified item is in cart, returns -1 otherwise
  private checkItemInCart(name: string) {
    for(let i in this.shoppingCart) {
      if(name.valueOf() == this.shoppingCart[i].name.valueOf()) {
        return Number(i);
      }
    }
    return -1;
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


  private checkout() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Checkout',
      message: 'Are you sure you want to make this purchase automatically charged to your American Express account for a total of $' + this.calculateFinalPrice() + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            var transaction: Transaction = new Transaction();
            transaction.cart = this.shoppingCart;
            transaction.store = this.selectedStore;

            this.db.list('/transactions').push(transaction);
            this.clearCart();
            let alert = this.alertCtrl.create({
              title: 'Thank You',
              message: 'Your payment is being processed and will be reflected on your American Express card balance soon.',
              buttons: ['Dismiss']
            });
            alert.present();
          }
        }
      ]
    });
    alert.present();
  }


}
