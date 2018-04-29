import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {photo} from "../../../JianLiPZ/newpz1/newpz1";
import {ApiUrl} from "../../../../providers/Constants";

/**
 * Generated class for the EpWitSampleSeePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-wit-sample-see',
  templateUrl: 'ep-wit-sample-see.html',
})
export class EpWitSampleSeePage {

  public ePWitSamp;
  ResultDesc;
  ePfiles;
  photoes:photo[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ePWitSamp = this.navParams.get('EPWitSamples');
    this.ePfiles = this.ePWitSamp.EPCSParent.EPCSFiles;
    for (var i = 0; i < this.ePfiles.length; i++) {
      var p = new photo();
      var tupian = this.ePfiles[i].FileName.substr(this.ePfiles[i].FileName.lastIndexOf('.'));
      if (tupian == '.png' || tupian == '.jpg' || tupian == '.gif' || tupian == '.tiff' || tupian == '.svg') {
        p.src = ApiUrl.slice(0, ApiUrl.length - 4) + this.ePfiles[i].FilePath.substring(2);
        p.isPhoto = true;
      } else {
        p.src = this.ePfiles[i].FileName;
        p.isPhoto = false;
      }
      this.photoes.push(p);
      this.photoes[i].ePfile = this.ePfiles[i];

    }

    /**EPEntryResult
     0   --  抽样中
     1   --  送审中
     2   --  复审中
     3   --  合格
     4   --  不合格
     **/
    switch (this.ePWitSamp.State){
      case 0:this.ResultDesc = '抽样中';
              break;
      case 1:this.ResultDesc = '送审中';
              break;
      case 2:this.ResultDesc = '复审中';
              break;
      case 3:this.ResultDesc = '合格';
              break;
      case 4:this.ResultDesc = '不合格';
              break;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpWitSampleSeePage');
  }


  goBack(){
    this.navCtrl.pop();
  }
}
