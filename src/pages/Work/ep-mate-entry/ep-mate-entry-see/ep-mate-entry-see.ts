import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiUrl} from "../../../../providers/Constants";
import {MaterialInfo} from "../../../../Model/EPMateInfoForEntry";
import {HttpService} from "../../../Service/HttpService";
import {Photo} from "../../../../providers/ChoosePhotoService";

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
  curMaterialInfo :MaterialInfo = new MaterialInfo();
  photoes:Photo[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpService) {
    this.ePMaterials = this.navParams.get('EPMaterials');
    let ePfiles = this.ePMaterials.EPCSParent.EPCSFiles;
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

    if(this.ePMaterials.EPMateInfoForEntries.length!=0){
      this.curMaterialInfo = this.ePMaterials.EPMateInfoForEntries[0].MaterialInfo;
    }

    this.http.get(ApiUrl+'MaterialInfoes/GetMaterialInfoes').subscribe(res=>{
      res.materialInfos.forEach(v=>{
        if(v.MaterialInfoID==this.ePMaterials.EPMateInfoForEntries[0].MaterialInfoID){
          this.curMaterialInfo = v;
        }
      });
    },error=>{
      console.log(error);
    });
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

    if(itemResult=='EPMR01'){
      return '进场';
    }else if(itemResult=='EPMR02'){
      return '退场';
    }else if(itemResult=='EPMR03'){
      return '进场后检测';
    }
  }
}
