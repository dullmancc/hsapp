import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {photo} from "../../../JianLiPZ/newpz1/newpz1";
import {ApiUrl} from "../../../../providers/Constants";

/**
 * Generated class for the EpMateEntrySeePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-mate-entry-see',
  templateUrl: 'ep-mate-entry-see.html',
})
export class EpMateEntrySeePage {

  public ePMaterials;

  ePfiles;
  photoes:photo[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ePMaterials = this.navParams.get('EPMaterials');
    this.ePfiles = this.ePMaterials.EPCSParent.EPCSFiles;
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpMateEntrySeePage');
  }


    goBack(){
      this.navCtrl.pop();
    }
  /**EPEntryResult
   EPMR01   --  进场
   EPMR02   --  退场
   EPMR03   --  进场后检测
   **/
  GetResult(itemResult){
    switch (itemResult){
      case 'EPMR01': return '进场';
      case 'EPMR02': return '退场';
      case 'EPMR02': return '进场后检测';
    }
  }
}
