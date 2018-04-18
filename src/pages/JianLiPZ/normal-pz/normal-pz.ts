import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {photo} from "../newpz1/newpz1";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject,FileUploadOptions} from "@ionic-native/file-transfer";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {ActionSheet, ActionSheetOptions} from "@ionic-native/action-sheet";
import {HttpService} from "../../Service/HttpService";
import {File} from "@ionic-native/file";

/**
 * Generated class for the NormalPzPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-normal-pz',
  templateUrl: 'normal-pz.html',
})
export class NormalPzPage {
  loader;
  photoes:photo[]=[];
  PZrecord:any={
    PangzhanId:"",
    EmployeeID:"",
    Processno :"",
    Partno:"",
    ProductNo:"",
    BeginTime:"",
    PreBeginTime:"",
    EndTime:"",
    PreEndTime:"",
    ConstructionCase:"",
    SupervisorCase:"",
    FindPromble:"",
    Suggestion:"",
    Remark:"",
    ImagePath :"",
    IsSubmit :"",
    PZBelongId:"",};
  Pangzhanid:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private camera: Camera,
  private actionSheet:ActionSheet,
  private imagePicker: ImagePicker,private http: HttpService,private transfer: FileTransfer,
  private file: File ,public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.PZrecord.EmployeeID = this.navParams.get('userid');
    this.PZrecord.PZBelongId = this.navParams.get('pzblid');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NormalPzPage');
  }
  save(IsSubmit){
    this.PZrecord.SupervisorCase = '';
    this.PZrecord.IsSubmit = IsSubmit;
    this.PZrecord.Partno = this.PZrecord.Partno+'层结构剪力墙、柱';
    this.PZrecord.Processno =  this.PZrecord.Processno+'层梁、板混凝土浇筑';
    if(typeof (this.PZrecord.PreBeginTime)=='undefined'){
      this.PZrecord.PreBeginTime = '2000-01-01';
    }
    if(typeof (this.PZrecord.BeginTime)=='undefined'){
      this.PZrecord.BeginTime = '2000-01-01';
    }
    if(typeof (this.PZrecord.PreEndTime)=='undefined'){
      this.PZrecord.PreEndTime = '2000-01-01';
    }
    if(typeof (this.PZrecord.EndTime)=='undefined'){
      this.PZrecord.EndTime = '2000-01-01';
    }
    var data = 'PangzhanId='+this.PZrecord.PangzhanId+'&EmployeeID='+this.PZrecord.EmployeeID+
      '&Processno='+this.PZrecord.Processno+'&Partno='+this.PZrecord.Partno+
      '&ProductNo='+this.PZrecord.ProductNo+'&BeginTime='+this.PZrecord.BeginTime+
      '&PreBeginTime='+this.PZrecord.PreBeginTime+'&EndTime='+this.PZrecord.EndTime+
      '&PreEndTime='+this.PZrecord.PreEndTime+'&ConstructionCase='+this.PZrecord.ConstructionCase+
      '&SupervisorCase='+this.PZrecord.SupervisorCase+'&FindPromble='+this.PZrecord.FindPromble+
      '&Suggestion='+this.PZrecord.Suggestion+'&Remark='+this.PZrecord.Remark+'&ImagePath='+
      this.PZrecord.ImagePath+'&IsSubmit='+this.PZrecord.IsSubmit+'&PZBelongId='+this.PZrecord.PZBelongId;
    this.http.post('http://193.112.12.241/HSWebApi/api/Pangzhan/PostPangzhan',data).subscribe(res=>{
      alert(res.ErrorMs);
      console.log(res.Pangzhanid);
      this.Pangzhanid = res.Pangzhanid;
    },error=>{
      alert(error);
    });
  }

  upFile(i) {
    console.log(this.photoes.length);
    if (i < this.photoes.length) {

      var fileTransfer: FileTransferObject = this.transfer.create();

      let options: FileUploadOptions = {
        fileKey: 'ionicfile',
        fileName: 'ionicfile',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }
      fileTransfer.upload(this.photoes[i].src, 'http://193.112.12.241/HSWebApi/api/Pangzhan/Post?panzhangid='+this.Pangzhanid+'&EmployeeId='+this.PZrecord.EmployeeID, options)
        .then((data) => {
          i++;
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
  changeDate():void{
    let startTime=this.PZrecord.BeginTime.toString();
    let endTime=this.PZrecord.EndTime.toString();
    if(startTime>endTime)
    {
      alert("开始时间不能大于结束时间，请重新输入");
      this.PZrecord.EndTime=this.PZrecord.BeginTime;
    }
  }

  changePlanDate():void {
    let planEndTime=this.PZrecord.PreEndTime.toString();
    let planStartTime=this.PZrecord.PreBeginTime.toString();
    if(planStartTime>planEndTime){
      alert("计划开始时间不能大于计划结束时间,请重新输入");
      this.PZrecord.PreEndTime=this.PZrecord.PreBeginTime;
    }
  }

  addPhoto():void{
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
          this.photoes.push(p);
        }, (err) => {
          console.log(err);
        });
      if(buttonIndex==2)
        this.imagePicker.getPictures(options1).then((results) => {
          for (var i = 0; i < results.length; i++) {
            let p=new photo();
            p.src=results[i];
            this.photoes.push(p);
          }
        }, (err) => {
          console.log('获取图片失败');
        });
    });
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
