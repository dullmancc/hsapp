import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicPage, LoadingController, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {EPEntryResult,EPMaterials} from "../../../Model/EPMaterials";
import {HttpService} from "../../Service/HttpService";
import {ApiUrl} from "../../../providers/Constants";
import {Utils} from "../../../providers/Utils";
import {EpAddMatePage} from "./ep-add-mate/ep-add-mate";
import {EPMateInfoForEntry, MaterialInfo} from "../../../Model/EPMateInfoForEntry";
import {ChoosePhotoService, Photo} from "../../../providers/ChoosePhotoService";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {EPCSFile} from "../../../Model/EPCSFile";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ActionSheet} from "@ionic-native/action-sheet";

/**
 * Generated class for the EpMateEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-mate-entry',
  templateUrl: 'ep-mate-entry.html',
})
export class EpMateEntryPage {

  public photoes:Photo[]=[];
  //当前材料种类信息
  public curMateInfo:MaterialInfo;
  //材料进场记录
  public ePMaterials:EPMaterials;
  //材料型号记录
  public ePMateInfoForEntry:EPMateInfoForEntry[]=[];
  //材料进场审批
  public epmatecheck;
  public EmployeeID;
  //页面类型 type
  public type;
  //进场类型
  public EnterType;
  //所有与该工程相关的施工单位
  public ECUnit=[];
  //当前选择施工单位
  public curECUnit;
  //当前进场结果
  public EProjectID;

  constructor(private camera: Camera,
              private actionsheetCtrl:ActionSheetController,
              private actionSheet:ActionSheet,
              private imagePicker: ImagePicker,
              private alertCtrl:AlertController,
              private transfer: FileTransfer,
              private loadingCtrl: LoadingController,

              public platform:Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              public http:HttpService,
              private choosephoto:ChoosePhotoService,
              public toastCtrl: ToastController) {
    this.epmatecheck = this.navParams.get('EPMaterialsCheck');
    this.EmployeeID = this.navParams.get('EmployeeID');
    this.type = this.navParams.get('Type');
    this.EProjectID = this.navParams.get('EProjectID');
    console.log(this.EProjectID);
    if(this.type==1){
      this.ePMaterials = this.navParams.get('EPMaterials');
      console.log(this.ePMaterials);
      this.initPhoto();
      if(this.ePMaterials.EPMateInfoForEntries.length>0){
        this.curMateInfo = this.ePMaterials.EPMateInfoForEntries[0].MaterialInfo;
      }else{
        this.curMateInfo = new MaterialInfo();
      }
      this.choosephoto.InitParams(this.ePMaterials.EPCSID,this.EmployeeID);
      this.choosephoto.InitPhoto(this.photoes);
      this.ePMateInfoForEntry = this.ePMaterials.EPMateInfoForEntries;
    }else if(this.type==0){
      this.ePMaterials = new EPMaterials(this.epmatecheck.ECUnit,this.EmployeeID,this.epmatecheck.EPCheckID,this.EProjectID);
      this.EnterType = this.navParams.get("EnterType");
      this.curMateInfo = new MaterialInfo();
      this.ePMaterials.entryType = this.EnterType;
      this.ePMateInfoForEntry = [];
    }


    this.http.get(ApiUrl+'Project/GetECUnit').subscribe(res=>{
      this.ECUnit = res;
      this.ECUnit.forEach(v=>{
        if(v.ECUnitID==this.ePMaterials.ECUnitID){
          this.curECUnit = v;
        }
      });
    },error=>{
      alert(error);
    });
  }

  newSecIssues(IsSubmit){
    this.ePMaterials.State = IsSubmit;
    if(typeof this.curECUnit !=='undefined'){
      this.ePMaterials.ECUnitID = this.curECUnit.ECUnitID;
    }
    var data = Utils.ParamsToString(this.ePMaterials);

    this.http.post(ApiUrl+'EPMateEntries/PostEPMatesEntry',data).subscribe(res=>{
      this.presentToast(res.ErrorMs);
      this.choosephoto.InitParams(res.EPCSParentID,this.EmployeeID);
      if(res.EPCSParentID!=-1){
        this.ePMaterials.EPCSID = res.EPCSParentID;
        this.ePMateInfoForEntry.forEach(V=>{
          V.EPMateEntryID = res.EPCSParentID;
            let data1 = Utils.ParamsToString(V);
            this.http.post(ApiUrl+'EPMateInfoForEntries/PostEPMateInfoForEntry?Type='+IsSubmit,data1).subscribe(res1=>{
              V.EPMateInfoForEntryID = res1.EPMateInfoForEntryID;
              console.log(res1);
              },error=>{
              console.log(error);
            });
        });
        if(IsSubmit==1){
          this.navCtrl.pop();
        }
      }
    },error=>{
      this.presentToast(error.toString());
    });
  }

  initPhoto(){
    let ePfiles = this.ePMaterials.EPCSParent.EPCSFiles;
    this.photoes = [];
    for(var i = 0;i<ePfiles.length;i++){
      var p = new  Photo();
      var tupian = ePfiles[i].FileName.substr(ePfiles[i].FileName.lastIndexOf('.'));
      if(tupian=='.png'||tupian=='.jpg'||tupian=='.gif'||tupian=='.tiff'||tupian=='.svg'){
        p.src = ApiUrl.slice(0,ApiUrl.length-4)+ ePfiles[i].FilePath.substring(2);
        p.isPhoto = true;
      }else{
        p.src = ePfiles[i].FileName;
        p.isPhoto = false;
      }
      p.isupload = true;
      this.photoes.push(p);
      this.photoes[i].ePfile = ePfiles[i];
    }
    this.choosephoto.InitPhoto(this.photoes);
  }

  ionViewDidLoad(){
    if(this.ePMaterials.EPCSID==""){

    }else {
        this.http.get(ApiUrl+'EPWitnSamples/GetEPFiles?EPCSID='+this.ePMaterials.EPCSID).subscribe(res=>{
          this.ePMaterials.EPCSParent.EPCSFiles = res;
          this.initPhoto();
        },error=>{
          this.presentToast(error.toString());
        });
    }
  }

  addMateInfo(){
    let data={
        'EPCSID':this.ePMaterials.EPCSID,
        'curMateInfo':this.curMateInfo,
        'ePMateInfoForEntry':this.ePMateInfoForEntry,
        callback:data=>{
          this.curMateInfo = data.MaterialInfoName;
          this.ePMateInfoForEntry = data.Record;
          console.log(this.curMateInfo);
          console.log(this.ePMateInfoForEntry);
        }
    }
    this.navCtrl.push(EpAddMatePage,data);
  }

  goBack(){
    this.navCtrl.pop();
  }
  compare1Fn(e1:EPEntryResult, e2: EPEntryResult): boolean {
    return e1 && e2 ? e1.EPEntryResultID === e2.EPEntryResultID : e1 === e2;
  }
  compare3Fn(e1:any, e2: any): boolean {
    return e1 && e2 ? e1.ECUnitID === e2.ECUnitID : e1 === e2;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  addPhoto():void{
    this.photoes =  this.choosephoto.addPhoto();
  }

  deletePhoto(i:number){
    this.photoes = this.choosephoto.deletePhoto(i);
  }
}
