import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {photo} from "../../../JianLiPZ/newpz1/newpz1";

/**
 * Generated class for the SecIssRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sec-iss-record',
  templateUrl: 'sec-iss-record.html',
})
export class SecIssRecordPage {
  photoes:photo[]=[];
  gaming;
  risk;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SecIssRecordPage');
  }
  newSecIssues(){

  }

  goBack(){
    this.navCtrl.pop();
  }

  deletePhoto(i:number){
    if(0<=i&&i<=this.photoes.length-1)
    {
      for(let k=i;k<this.photoes.length-1;k++)
      {
        this.photoes[k]=this.photoes[k+1];
      }
      this.photoes.length--;
    }
  }
}
