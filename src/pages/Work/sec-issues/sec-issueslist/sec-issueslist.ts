import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SecIssRecordPage} from "../sec-iss-record/sec-iss-record";

/**
 * Generated class for the SecIssueslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sec-issueslist',
  templateUrl: 'sec-issueslist.html',
})
export class SecIssueslistPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SecIssueslistPage');
  }
}
