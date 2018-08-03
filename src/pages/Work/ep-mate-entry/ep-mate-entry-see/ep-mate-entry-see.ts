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
  //是从哪个tabs进来的 （未完成，复检中，退场，进场）
  type;
  //见证取样的状态
  state = 0;
  //是否显示mybt
  mybtShow:boolean=true;
  sums = 0;
  public ePMaterials;
  curMaterialInfo :MaterialInfo = new MaterialInfo();
  photoes:Photo[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpService) {
    this.ePMaterials = this.navParams.get('EPMaterials');

    http.get(ApiUrl+"Pangzhan/GetEPCSFile?EPCSID="+this.ePMaterials.EPCSID).subscribe(data=>{
      let ePfiles = data;
      this.type = this.navParams.get('EntryResult');
      if(ePfiles) {
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
      }
    });

    this.initAddWitn();

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

  initAddWitn(){
    if(this.ePMaterials.EPMateInfoForEntries.length!=0){
      this.curMaterialInfo = this.ePMaterials.EPMateInfoForEntries[0].MaterialInfo;
      for(let i =0;i< this.ePMaterials.EPMateInfoForEntries.length;i++){

        //Mybt 默认显示 type == 1 复检页面
        //type >=2  state <3 不显示 ，即有些进场有些复检的页面，在进场或退场中显示
        //
        if(this.type==1){
          if(this.ePMaterials.EPMateInfoForEntries[i].EPWitnSample!=null){
            this.addwitntext = "请输入复试评估";
            this.state = 1;
            this.mybtShow = true;
            //判断mybt显示
            break;
          }
        }else{
          if(this.ePMaterials.EPMateInfoForEntries[i].EPWitnSample!=null){
            if(this.ePMaterials.EPMateInfoForEntries[i].EPWitnSample.State>=3){
              this.state = 2;
              this.addwitntext = "查看复试评估";
              this.mybtShow = true;
            }
            //判断mybt显示
            break;
          }else{
            this.mybtShow = false;
          }
        }
      }
    }
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
      return '正在退场';
    }else if(itemResult=='EPMR03'){
      return '进场后检测';
    }else if(itemResult=='EPMR04'){
      return '已退场';
    }
  }

  AddWitnSample(){
      if(this.state==0){
        this.navCtrl.push(EpWitRecordNumsPage,{"EPMaterials":this.ePMaterials,callback:data=>{
            this.ePMaterials = data;
            console.log(this.ePMaterials);
            //回调页面刷新
            this.initAddWitn();
          }});
      }else if(this.state==1){
        this.navCtrl.push(EpWitSamplePage,{"EPMaterials":this.ePMaterials.EPMateInfoForEntries,callback:data=>{
            this.ePMaterials.EPMateInfoForEntries = data;
            console.log(this.ePMaterials.EPMateInfoForEntries);
            this.initAddWitn();
          }}
          );
      }else if(this.state==2){
        this.navCtrl.push(EpWitSampleSeePage,{"EPMaterials":this.ePMaterials.EPMateInfoForEntries});
      }
  }
}
