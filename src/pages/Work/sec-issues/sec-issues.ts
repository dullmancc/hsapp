import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ContactPage} from "../../contact/contact";
import {FriendPage} from "../../friend/friend";
import {AboutPage} from "../../about/about";
import {ErrorPage} from "../../error/error";
import {SecIssueslistPage} from "./sec-issueslist/sec-issueslist";
import {SecIssRecordPage} from "./sec-iss-record/sec-iss-record";

/**
 * Generated class for the SecIssuesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sec-issues',
  templateUrl: 'sec-issues.html',
})
export class SecIssuesPage {
  tab1Root:any = SecIssueslistPage;
  tab2Root:any = SecIssueslistPage;
  tab3Root:any = ErrorPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SecIssuesPage');
  }

  goBack(){
    this.navCtrl.pop();
  }
  newPZBL(){

  }

  addSecurityIssues(){
    this.navCtrl.push(SecIssRecordPage);
  }
}
