import { Component} from '@angular/core';
import {
  IonicPage, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {HttpService} from "../../Service/HttpService";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {PzRecord} from "../../../Model/EPPangzhan";
import {Utils} from "../../../providers/Utils";
import {ApiUrl} from "../../../providers/Constants";
import {ChoosePhotoService, Photo} from "../../../providers/ChoosePhotoService";
/**
 * Generated class for the ExitPzRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//const url = "http://193.112.12.241/HSWebApi/api/";
@IonicPage()
@Component({
  selector: 'page-exit-pz-record',
  templateUrl: 'exit-pz-record.html',
})

export class ExitPzRecordPage {
  photoes:Photo[]=[];
  startTime:any;
  endTime:any;
  planStartTime:any;
  planEndTime :any;
  PZrecord:PzRecord;
  //页面类型
  PZtype:number;
  //按钮样式
  btcs:string;
  btcs1;
  //文件传输
  Trans

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpService,
              private transfer: FileTransfer,
              private file: File ,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              private choosephoto:ChoosePhotoService) {

    this.PZrecord = this.navParams.get('record');
    this.PZtype = this.navParams.get('type');
    //判断该页面为查看页面 or 保存页面
    if(this.PZtype>0){
      this.btcs = 'none';

    }else {
      this.btcs1 = 'none';
    }

    if(this.PZrecord!=null){
      let ePfiles = this.PZrecord.EPCSParent.EPCSFiles;
      for(var i = 0;i<ePfiles.length;i++){
        var p = new  Photo();
        p.src = ApiUrl.slice(0,ApiUrl.length-4)+ ePfiles[i].FilePath.substring(2);
        this.photoes.push(p);
        this.photoes[i].ePfile = ePfiles[i];
      }
    }

    this.choosephoto.InitPhoto(this.photoes);
    this.choosephoto.InitParams(this.PZrecord.EPCSID,this.PZrecord.Employee_EmployeeID);
    this.Trans = this.transfer.create();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExitPzRecordPage');
  }

  save(IsSubmit){
    this.checkTime();
    this.PZrecord.State = IsSubmit;
    var data = Utils.ParamsToString(this.PZrecord);

    this.http.post(ApiUrl+'Pangzhan/PostPangzhan',data).subscribe(res=>{
      this.presentToast(res.ErrorMs);
    },error=>{
      this.presentToast(error.toString());
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

  goBack(){
    this.navCtrl.pop();
  }
  
  Download(){
    let loader = this.loadingCtrl.create({
      content: "文档导出中..."
    });
    loader.present();

      const url1 = ApiUrl+'Pangzhan/Get?id='+this.PZrecord.EPCSID;
      this.Trans.download(url1, this.file.externalApplicationStorageDirectory  + 'Out1.doc').then((entry) => {
        console.log('download complete: ' + entry.toURL());
        loader.dismiss();
        this.presentToast("文档导出完成，存储路径为:"+entry.toURL());
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
    this.photoes = this.choosephoto.addPhoto();
  }

  deletePhoto(i:number){
    this.photoes = this.choosephoto.deletePhoto(i);
  }
}

