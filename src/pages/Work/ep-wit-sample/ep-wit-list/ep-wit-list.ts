import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EpWitSamplePage} from "../ep-wit-sample";

/**
 * Generated class for the EpWitListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-wit-list',
  templateUrl: 'ep-wit-list.html',
})
export class EpWitListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpWitListPage');
  }
  goBack(){
    this.navCtrl.pop();
  }
  addEPWit(){
    this.navCtrl.push(EpWitSamplePage);
  }
}
