import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {HttpService} from "../../Service/HttpService";

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


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private actionSheet:ActionSheet,
              private imagePicker: ImagePicker,private http: HttpService,private transfer: FileTransfer,
              private file: File ,public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.PZrecord.EmployeeID = this.navParams.get('userid');
    this.PZrecord.PZBelongId = this.navParams.get('pzblid');
  }
  save(IsSubmit){
    this.PZrecord.PreBeginTime = this.planStartTime;
    this.PZrecord.PreEndTime = this.planEndTime;
    this.PZrecord.BeginTime = this.startTime;
    this.PZrecord.EndTime = this.endTime;
    this.PZrecord.ConstructionCase = '1.采用'+this.sgCase.w1+'商品混凝土厂家生产的商品砼，'+this.sgCase.w2+'根振动棒振捣，现场有施工员'+this.sgCase.w3
                                      +'名，质检员'+this.sgCase.w4+'名，施工作业人员'+this.sgCase.w5+'名，完成的混凝土数量共有'+this.sgCase.w6+
                                      'm³，其中X层剪力墙、柱C40，'+this.sgCase.w7+'m³，Y层梁、板C30，'+this.sgCase.w8
                                      + 'm³,润滑砼泵管的砂浆已用接料斗另外装着，没有直接灌入柱、墙、板中。2.施工顺序、施工缝的处理均按施工方案进行施工。现场共抽查砼坍落度'
                                      + this.sgCase.w9+'次，设计坍落度为'+this.sgCase.w10+ 'mm，实际为'+this.sgCase.w11+ 'mm，符合设计及规范要求,砼严禁加生水。现场共做混凝土试块10组，其中C30'
                                      +this.sgCase.w12+'组，标养'+this.sgCase.w13+'组，同条件'+this.sgCase.w14+ '组；C40'+this.sgCase.w15+ '组，标养'+this.sgCase.w16+ '组，同条件'+this.sgCase.w17+
                                      '组。抽查了板砼的厚度共'+this.sgCase.w18+ '处，设计厚度为'+this.sgCase.w19+'mm，实际为'+this.sgCase.w20+
                                      '剪力墙、柱、梁、板浇捣顺序，剪力墙、柱与梁、板不同标号砼之间的处理措施严格按照施工方案执行。砼浇筑完后，施工单位对梁板砼表面进行了二次压实，并采用薄膜和（或）毛毡覆盖保养。'
                                      +'\n'+'施工情况附加信息:'+this.sgCase.w21;
    this.PZrecord.SupervisorCase = '';
    this.PZrecord.FindPromble = this.findProblem;
    this.PZrecord.Suggestion = this.dealCase;
    this.PZrecord.IsSubmit = IsSubmit;
    this.PZrecord.Partno = this.part+'层结构剪力墙、柱';
    this.PZrecord.Processno = this.gongxu+'层梁、板混凝土浇筑';
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
