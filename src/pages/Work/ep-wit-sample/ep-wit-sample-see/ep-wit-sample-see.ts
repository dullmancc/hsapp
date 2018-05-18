import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiUrl} from "../../../../providers/Constants";
import {Photo} from "../../../../providers/ChoosePhotoService";

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
  photoes:Photo[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ePWitSamp = this.navParams.get('EPWitSamples');
    let ePfiles = this.ePWitSamp.EPCSParent.EPCSFiles;
    for (var i = 0; i < ePfiles.length; i++) {
      var p = new Photo();
      var tupian = ePfiles[i].FileName.substr(ePfiles[i].FileName.lastIndexOf('.'));
      if (tupian == '.png' || tupian == '.jpg' || tupian == '.gif' || tupian == '.tiff' || tupian == '.svg') {
        p.src = ApiUrl.slice(0, ApiUrl.length - 4) + ePfiles[i].FilePath.substring(2);
        p.isPhoto = true;
      } else {
        p.src = ePfiles[i].FileName;
        p.isPhoto = false;
      }
      this.photoes.push(p);
      this.photoes[i].ePfile = ePfiles[i];

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
