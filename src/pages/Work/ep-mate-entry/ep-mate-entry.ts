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
  /*
  //一张图片上传   递归实现多张图片上传
  upFile(i) {
    //上传了跳过
    if(i < this.photoes.length){
      if(this.photoes[i].isupload){
        return this.upFile(i+1);
      }
    }

    console.log("i: "+i+",length: "+this.photoes.length);
    if (i < this.photoes.length) {
      var fileTransfer: FileTransferObject = this.transfer.create();
      //fileName->在服务端保持唯一性 不唯一会被覆盖
      let options: FileUploadOptions = {
        fileKey: 'ionicfile'+i.toString(),
        fileName: 'ionicfile'+i+'.png',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }

      let data;
      var datastr;
      if(this.params=='EPCSID'){
        data = {'FileUpPerson':this.EmployeeID,'EPCSID':this.ePMaterials.EPCSID};
        datastr = Utils.ParamsToString(data);
      }else{
        data = {'FileUpPerson':this.EmployeeID,'EPMateInfoForEntryID':this.ePMaterials.EPCSID};
        datastr = Utils.ParamsToString(data);
      }

      fileTransfer.upload(this.photoes[i].src, ApiUrl+this.url+'/PostFile?'+datastr, options)
        .then((data) => {
          //标记已上传
          this.photoes[i].isupload = true;
          //赋值EPSecFileID
          this.photoes[i].ePfile.EPSecFileID = JSON.parse(data.response).EPCSFileID;
          i++;
          //递归 上传下一张图片
          this.upFile(i);
        }, (err) => {
          console.log(err);
          this.photoes.slice(i,1);
          this.presentToast(err);
          i++;
          console.log('Error: '+i+",photo length: "+this.photoes.length);
          //递归 上传下一张图片
          this.upFile(i);
        });
    }else{
      console.log('DIsmiss End');
      this.loader.dismiss();
      this.presentToast("图片上传成功！");
    }
  }

  uploadFile() {
    if(this.photoes.length==0){
      return;
    }
    this.loader = this.loadingCtrl.create({
      content: "图片上传中..."
    });
    this.loader.present();
    this.upFile(0);
  }

  //添加图片
  addPhoto():Photo[]{
    //先保存再选择
    if(this.ePMaterials.EPCSID == ''){
      this.presentAlert();
      return [];
    }
    //相机配置
    const options0: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation : true,
      saveToPhotoAlbum:true
    };
    // 设置选项
    const options1: ImagePickerOptions = {
      maximumImagesCount:9,
      quality: 100
    };

    let actionSheet = this.actionsheetCtrl.create({
      title: '选择图片的方式',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: '相册',
          handler: () => {
            this.imagePicker.getPictures(options1).then((results) => {
              //每一张图片创建Photo类
              for (var i = 0; i < results.length; i++) {
                let p=new Photo();
                console.log(results[i]);
                p.ePfile = new EPCSFile(this.ePMaterials.EPCSID,this.EmployeeID);
                p.src=results[i];
                p.isupload = false;
                this.photoes.push(p);
              }
              this.uploadFile();
              //选择完毕即上传
              //this.uploadFile();
            }, (err) => {
              console.log(err);
              console.log('获取图片失败');
            });
          }
        },
        {
          text: '拍照',
          handler: () => {
            this.camera.getPicture(options0).then((imageData) => {
              let base64Image = 'data:image/jpeg;base64,' + imageData;
              console.log(base64Image);
              let p=new Photo();
              p.ePfile = new EPCSFile(this.ePMaterials.EPCSID,this.EmployeeID);
              p.src=base64Image;
              p.isupload = false;
              this.photoes.push(p);
              this.uploadFile();

            }, (err) => {
              console.log(err+'is error');
            });
          }
        },
        {
          text: '取消',
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

    return this.photoes || [];
  }

  deletePhoto(i:number){
    this.http.post(ApiUrl+this.url+'/DeleteFile?FileID='+this.photoes[i].ePfile.EPSecFileID,{}).subscribe(res=>{
      console.log(res);
      if(0<=i&&i<=this.photoes.length-1)
      {
        for(let k=i;k<this.photoes.length-1;k++)
        {
          this.photoes[k]=this.photoes[k+1];
        }
        this.photoes.length--;
      }
    },error=>{
      console.log(error);
      alert("删除失败！");
    });

    return this.photoes || [];
  }

  //提示框
  presentAlert(){
    let alert = this.alertCtrl.create({
      title: '选择图片失败',
      subTitle: '请先保存后，再选择图片！',
      buttons: ['确认']
    });

    alert.present();
  }
  */

}
