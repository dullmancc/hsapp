import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {photo} from "../newpz1/newpz1";
import {HttpService} from "../../Service/HttpService";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ActionSheet, ActionSheetOptions} from "@ionic-native/action-sheet";
/**
 * Generated class for the ExitPzRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-exit-pz-record',
  templateUrl: 'exit-pz-record.html',
})

export class ExitPzRecordPage {
  photoes:photo[]=[];
  startTime:any;
  endTime:any;
  planStartTime:any;
  planEndTime :any;
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
    PZtype:number;
    btcs:string;
  btcs1;
  Trans;
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
    if(this.PZrecord.ImagePath!=null){
      var arr = this.PZrecord.ImagePath.split(',');
      for(var i = 0;i<arr.length;i++){
        arr[i]='http://193.112.12.241'+ arr[i].substring(1);
        var p = new  photo();
        p.src = arr[i];
        this.photoes.push(p);
      }
    }
    this.Trans = transfer.create();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExitPzRecordPage');
  }
  save(IsSubmit){
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
    },error=>{
      alert(error);
    });
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

  Download(){
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();

      const url = 'http://193.112.12.241/HSWebApi/api/Pangzhan/Get?id='+this.PZrecord.PangzhanId;
      this.Trans.download(url, this.file.externalApplicationStorageDirectory  + 'Out1.doc').then((entry) => {
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

  reUpload(){
    this.photoes = [];
    this.cd.detectChanges();
    this.http.post("http://193.112.12.241/HSWebApi/api/Pangzhan/Repostimg",this.PZrecord.PangzhanId).subscribe(res=>{
      alert("已清除原先上传图片，请重新上传");
    },error=>{
      alert("清除失败，请重试！");
    });
  }
}
export class PzRecord{
  public PangzhanId;
  public EmployeeID;
  public Processno ;
  public Partno;
  public ProductNo;
  public BeginTime;
  public PreBeginTime;
  public EndTime;
  public PreEndTime;
  public ConstructionCase;
  public SupervisorCase;
  public FindPromble;
  public Suggestion;
  public Remark;
  public ImagePath;
  public IsSubmit;
  public PZBelongId;
}

