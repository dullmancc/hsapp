import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {photo} from "../newpz1/newpz1";
import {HttpService} from "../../Service/HttpService";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ActionSheet, ActionSheetOptions} from "@ionic-native/action-sheet";
import {PzRecord} from "../../../Model/EPPangzhan";
import {Utils} from "../../../providers/Utils";
import {EPCSFile} from "../../../Model/EPCSFile";
import {ApiUrl} from "../../../providers/Constants";
/**
 * Generated class for the ExitPzRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const url = "http://localhost:1857/api/";
//const url = "http://193.112.12.241/HSWebApi/api/";
@IonicPage()
@Component({
  selector: 'page-exit-pz-record',
  templateUrl: 'exit-pz-record.html',
})

export class ExitPzRecordPage {
  photoes:photo[]=[];
  ePfiles:EPCSFile[] = [];
  startTime:any;
  endTime:any;
  planStartTime:any;
  planEndTime :any;
  PZrecord:PzRecord;
  PZtype:number;
  btcs:string;
  btcs1;
  Trans;
  loader;
  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
              private actionSheet:ActionSheet,
              private imagePicker: ImagePicker,private http: HttpService,private transfer: FileTransfer,
              private file: File ,public loadingCtrl: LoadingController, public toastCtrl: ToastController,private cd:ChangeDetectorRef) {
    this.PZrecord = this.navParams.get('record');
    this.PZtype = this.navParams.get('type');
    console.log(this.PZtype);
    if(this.PZtype>0){
      this.btcs = 'none';

    }else {
      this.btcs1 = 'none';
    }

    if(this.PZrecord!=null){
      this.ePfiles = this.PZrecord.EPCSParent.EPCSFiles;
      for(var i = 0;i<this.ePfiles.length;i++){
        var p = new  photo();
        p.src = ApiUrl.slice(0,ApiUrl.length-4)+ this.ePfiles[i].FilePath.substring(2);
        this.photoes.push(p);
      }
    }
    this.Trans = transfer.create();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExitPzRecordPage');
  }
  save(IsSubmit){

    this.checkTime();
    this.PZrecord.State = IsSubmit;
    var data = Utils.ParamsToString(this.PZrecord);

    this.http.post(url+'Pangzhan/PostPangzhan',data).subscribe(res=>{
      alert(res.ErrorMs);
    },error=>{
      alert(error);
    });
  }

  checkTime(){
    if(typeof (this.PZrecord.SchBeginTime)=='undefined'){
      this.PZrecord.SchBeginTime = '2000-01-01';
    }
    if(typeof (this.PZrecord.BeginTime)=='undefined'){
      this.PZrecord.BeginTime = '2000-01-01';
    }
    if(typeof (this.PZrecord.SchEndTime)=='undefined'){
      this.PZrecord.SchEndTime = '2000-01-01';
    }
    if(typeof (this.PZrecord.EndTime)=='undefined'){
      this.PZrecord.EndTime = '2000-01-01';
    }
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

  upFile(i) {
    console.log(this.photoes.length);
    //上传了跳过
    if(this.photoes[i].isupload){
      return this.upFile(i+1);
    }

    if (i < this.photoes.length) {

      var fileTransfer: FileTransferObject = this.transfer.create();

      let options: FileUploadOptions = {
        fileKey: 'ionicfile',
        fileName: 'ionicfile',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }

      let data = {'FileUpPerson':this.PZrecord.Employee_EmployeeID,'EPCSID':this.PZrecord.PangzhanId};

      var datastr = Utils.ParamsToString(data);
      fileTransfer.upload(this.photoes[i].src, ApiUrl+'Pangzhan/PostFile?'+datastr, options)
        .then((data) => {
          i++;
          this.photoes[i].isupload = true;

          this.photoes[i].ePfile.EPSecFileID = JSON.parse(data.response).EPCSFileID;
          if (i == this.photoes.length ) {
            this.loader.dismiss();
          } else {
            this.presentToast(i-1 + "Image uploaded successfully");
            return this.upFile(i);
          }

        }, (err) => {
          console.log(err);
          this.loader.dismiss();
          this.presentToast(err);
        });
    }else{
      this.loader.dismiss();
      this.presentToast("Image uploaded successfully");
    }
  }

  uploadFile() {
    this.loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    this.loader.present();
    this.upFile(0);
  }

  Download(){
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();

      const url1 = 'http://193.112.12.241/HSWebApi/api/Pangzhan/Get?id='+this.PZrecord.PangzhanId;
      this.Trans.download(url1, this.file.externalApplicationStorageDirectory  + 'Out1.doc').then((entry) => {
        console.log('download complete: ' + entry.toURL());
        alert('download complete: ' + entry.toURL());
        loader.dismiss();
        this.presentToast("Image uploaded successfully");
      }, (error) => {
        // handle error
        loader.dismiss();
        alert(error);
        console.log(error);
      });
  }

  changeDate():void{
    let startTime=this.startTime.toString();
    let endTime=this.endTime.toString();
    if(startTime>endTime)
    {
      alert("开始时间不能大于结束时间，请重新输入");
      this.endTime=this.startTime;
    }
  }

  changePlanDate():void {
    let planEndTime=this.planEndTime.toString();
    let planStartTime=this.planStartTime.toString();
    if(planStartTime>planEndTime){
      alert("计划开始时间不能大于计划结束时间,请重新输入");
      this.planEndTime=this.planStartTime;
    }
  }

  addPhoto():void{
    if(this.PZrecord.PangzhanId == ''){
      alert("请先保存！");
      return;
    }
    const options0: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum:true
    };
    // 设置选项
    const options1: ImagePickerOptions = {
      maximumImagesCount:9,
      quality: 100
    };

    let buttonLabels = ['拍照', '从相册选择照片'];

    const options: ActionSheetOptions = {
      title: '请选择您想要获取图片的方式',
      buttonLabels: buttonLabels,
      addDestructiveButtonWithLabel: '取消',
      androidTheme: 5,
      destructiveButtonLast: true
    };

    this.actionSheet.show(options).then((buttonIndex: number) => {
      if(buttonIndex==1)
        this.camera.getPicture(options0).then((imageData) => {
          let base64Image = 'data:image/jpeg;base64,' + imageData;
          let p=new photo();
          p.src=base64Image;
          p.isupload = false;
          p.ePfile = new EPCSFile(this.PZrecord.PangzhanId,this.PZrecord.Employee_EmployeeID);
          this.photoes.push(p);
          this.uploadFile();

        }, (err) => {
          console.log(err);
        });
      if(buttonIndex==2)
        this.imagePicker.getPictures(options1).then((results) => {
          for (var i = 0; i < results.length; i++) {
            let p=new photo();
            p.ePfile = new EPCSFile(this.PZrecord.PangzhanId,this.PZrecord.Employee_EmployeeID);
            p.src=results[i];
            p.isupload = false;
            this.photoes.push(p);
            this.uploadFile();
          }
        }, (err) => {
          console.log('获取图片失败');
        });
    });
  }

  deletePhoto(i:number){
    this.http.post(ApiUrl+'Pangzhan/DeleteFile?FileID='+this.photoes[i].ePfile.EPSecFileID,{}).subscribe(res=>{
      if(0<=i&&i<=this.photoes.length-1)
      {
        for(let k=i;k<this.photoes.length-1;k++)
        {
          this.ePfiles[k] = this.ePfiles[k+1];
          this.photoes[k]=this.photoes[k+1];
        }
        this.ePfiles.length--;
        this.photoes.length--;
      }
    },error=>{
      alert("删除失败！");
    });

  }
}

