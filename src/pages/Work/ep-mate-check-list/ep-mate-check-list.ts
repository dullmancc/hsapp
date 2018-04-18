import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ListPage} from "../ep-mate-entry/list/list";
import {EpWitSamplePage} from "../ep-wit-sample/ep-wit-sample";

/**
 * Generated class for the EpMateCheckListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-mate-check-list',
  templateUrl: 'ep-mate-check-list.html',
})
export class EpMateCheckListPage {
  public enter:number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.enter = 1;
     this.enter = this.navParams.get("type");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpMateCheckListPage');
  }

  goBack(){
    this.navCtrl.pop();
  }

  EnterMate(){
    if(this.enter==1){
      this.navCtrl.push(ListPage);
    }else{
      this.navCtrl.push(EpWitSamplePage);
    }

  }
}
