import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EpMateEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-mate-entry',
  templateUrl: 'ep-mate-entry.html',
})
export class EpMateEntryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpMateEntryPage');
  }
  goBack(){
    this.navCtrl.pop();
  }
}
