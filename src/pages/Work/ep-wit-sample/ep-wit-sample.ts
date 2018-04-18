import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EpWitSamplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-wit-sample',
  templateUrl: 'ep-wit-sample.html',
})
export class EpWitSamplePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpWitSamplePage');
  }
  goBack(){
    this.navCtrl.pop();
  }
}
