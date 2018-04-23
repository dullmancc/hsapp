import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {HttpService} from "../../Service/HttpService";
import {ApiUrl} from "../../../providers/Constants";
import {Utils} from "../../../providers/Utils";
import {PzRecord} from "../../../Model/EPPangzhan";

@IonicPage()
export class photo
{
  public src:any;
}
@Component({
  selector: 'page-newpz1',
  templateUrl: 'newpz1.html',
})
export class Newpz1Page {
    loader;
    startTime:any;
    endTime:any;
    planStartTime:any;
    planEndTime :any;
    part:any;
    gongxu:any;
    findProblem:any;
    dealCase:any;
    sgCase:any={w1:"",w2:"",w3:"",w4:"",w5:"",
                 w6:"",w7:"",w8:"",w9:"",w10:"",
                w11:"",w12:"",w13:"",w14:"",w15:"",
                 w16:"",w17:"",w18:"",w19:"",w20:"",w21:""};
    photoes:photo[]=[];
    PZrecord:PzRecord;
    Pangzhanid:string;
    public PZBL;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private actionSheet:ActionSheet,
              private imagePicker: ImagePicker,private http: HttpService,private transfer: FileTransfer,
              private file: File ,public loadingCtrl: LoadingController, public toastCtrl: ToastController) {

    this.PZrecord = new PzRecord();

    this.PZrecord.Employee_EmployeeID = this.navParams.get('userid');
   // this.PZrecord.PZBelongId = this.navParams.get('pzbl').PZBelongId;
    this.PZBL = this.navParams.get('pzbl');
    this.PZrecord.PZBelongId =  this.PZBL.PZBelongId;
  }
  save(IsSubmit){
    this.PZrecord.ConstructionCase = Utils.StringToConstCase(this.sgCase);
    this.PZrecord.SupervisorCase = '';
    this.PZrecord.State = IsSubmit;
    this.PZrecord.Remark = '';
    this.PZrecord.SupervisorCase = '';

    this.PZrecord.Part = this.part+'层结构剪力墙、柱';
    this.PZrecord.Process = this.gongxu+'层梁、板混凝土浇筑';

    this.checkTime();
    var data = Utils.ParamsToString(this.PZrecord);
      /*
          var data = 'PangzhanId='+this.PZrecord.PangzhanId+'&EmployeeID='+this.PZrecord.EmployeeID+
            '&Processno='+this.PZrecord.Processno+'&Partno='+this.PZrecord.Partno+
            '&ProductNo='+this.PZrecord.ProductNo+'&BeginTime='+this.PZrecord.BeginTime+
            '&PreBeginTime='+this.PZrecord.PreBeginTime+'&EndTime='+this.PZrecord.EndTime+
            '&PreEndTime='+this.PZrecord.PreEndTime+'&ConstructionCase='+this.PZrecord.ConstructionCase+
            '&SupervisorCase='+this.PZrecord.SupervisorCase+'&FindPromble='+this.PZrecord.FindPromble+
            '&Suggestion='+this.PZrecord.Suggestion+'&Remark='+this.PZrecord.Remark+'&ImagePath='+
            this.PZrecord.ImagePath+'&IsSubmit='+this.PZrecord.IsSubmit+'&PZBelongId='+this.PZrecord.PZBelongId;*/
    this.http.post(ApiUrl+'Pangzhan/PostPangzhan',data).subscribe(res=>{
        alert(res.ErrorMs);
        console.log(res.Pangzhanid);
        this.Pangzhanid = res.Pangzhanid;
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
      fileTransfer.upload(this.photoes[i].src, ApiUrl+'Pangzhan/Post?panzhangid='+this.Pangzhanid+'&EmployeeId='+this.PZrecord.Employee_EmployeeID, options)
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
      this.PZrecord.EndTime =this.PZrecord.BeginTime;
    }
  }

  changePlanDate():void {
    let planEndTime=this.PZrecord.SchEndTime.toString();
    let planStartTime=this.PZrecord.SchBeginTime.toString();
    if(planStartTime>planEndTime){
      alert("计划开始时间不能大于计划结束时间,请重新输入");
      this.PZrecord.SchEndTime=this.PZrecord.SchBeginTime;
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
