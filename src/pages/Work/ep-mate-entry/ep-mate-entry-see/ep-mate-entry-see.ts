import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiUrl} from "../../../../providers/Constants";
import {MaterialInfo} from "../../../../Model/EPMateInfoForEntry";
import {HttpService} from "../../../Service/HttpService";
import {Photo} from "../../../../providers/ChoosePhotoService";
import {EpWitRecordNumsPage} from "../../ep-wit-sample/ep-wit-record-nums/ep-wit-record-nums";
import {EPWitnSample} from "../../../../Model/EPWitnSample";
import {EpWitSampleSeePage} from "../../ep-wit-sample/ep-wit-sample-see/ep-wit-sample-see";
import {EpWitSamplePage} from "../../ep-wit-sample/ep-wit-sample";

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

  addwitntext ="录入取样信息";
  type;
  state = 0;
  sums = 0;
  public ePMaterials;
  curMaterialInfo :MaterialInfo = new MaterialInfo();
  photoes:Photo[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpService) {
    this.ePMaterials = this.navParams.get('EPMaterials');
    let ePfiles = this.ePMaterials.EPCSParent.EPCSFiles;
    this.type = this.navParams.get('EntryResult');
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
      for(let i =0;i< this.ePMaterials.EPMateInfoForEntries.length;i++){
        if(this.ePMaterials.EPMateInfoForEntries[i].EPWitnSample!=null){
          this.addwitntext = "请输入复试评估";
          this.state = 1;
          if(this.ePMaterials.EPMateInfoForEntries[i].EPWitnSample.State>=3){
            this.state = 2;
            this.addwitntext = "查看复试评估";
          }
          break;
        }
      }
    }

    this.ePMaterials.EPMateInfoForEntries.forEach(V=>{
      this.sums = this.sums+V.EPMaterialNums;
    });

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

  AddWitnSample(){
      if(this.state==0){
        this.navCtrl.push(EpWitRecordNumsPage,{"EPMaterials":this.ePMaterials,callback:data=>{
            this.ePMaterials = data;
          }});
      }else if(this.state==1){
        this.navCtrl.push(EpWitSamplePage,{"EPMaterials":this.ePMaterials.EPMateInfoForEntries,callback:data=>{
            this.ePMaterials.EPMateInfoForEntries = data;
          }});
      }else if(this.state==2){
        this.navCtrl.push(EpWitSampleSeePage,{"EPMaterials":this.ePMaterials.EPMateInfoForEntries});
      }
  }
}
