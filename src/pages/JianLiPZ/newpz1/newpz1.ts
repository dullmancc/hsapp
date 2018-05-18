import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, AlertController, ToastController
} from 'ionic-angular';
import {HttpService} from "../../Service/HttpService";
import {ApiUrl} from "../../../providers/Constants";
import {Utils} from "../../../providers/Utils";
import {PzRecord} from "../../../Model/EPPangzhan";
import {ChoosePhotoService, Photo} from "../../../providers/ChoosePhotoService";

@IonicPage()
@Component({
  selector: 'page-newpz1',
  templateUrl: 'newpz1.html',
})
export class Newpz1Page {
    part:any;
    gongxu:any;

    sgCase:any={w1:"",w2:"",w3:"",w4:"",w5:"",
                 w6:"",w7:"",w8:"",w9:"",w10:"",
                w11:"",w12:"",w13:"",w14:"",w15:"",
                 w16:"",w17:"",w18:"",w19:"",w20:"",w21:""};
    photoes:Photo[]=[];
    PZrecord:PzRecord;
    Pangzhanid:string;
    public PZBL;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpService,
              private alertCtrl:AlertController,
              private toastCtrl:ToastController,
              private choosephoto:ChoosePhotoService) {

    this.PZrecord = new PzRecord();
    this.PZrecord.Employee_EmployeeID = this.navParams.get('userid');
    this.PZBL = this.navParams.get('pzbl');
    this.PZrecord.PZBelongId =  this.PZBL.PZBelongId;
    //初始化
    this.choosephoto.InitPhoto(this.photoes);
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
    this.http.post(ApiUrl+'Pangzhan/PostPangzhan',data).subscribe(res=>{
        this.presentToast(res.ErrorMs);
        this.PZrecord.EPCSID = res.EPCSParentID;
        this.Pangzhanid = res.EPCSParentID;
        //相册选择服务 使用前初始化
        this.choosephoto.InitParams(res.EPCSParentID,this.PZrecord.Employee_EmployeeID);
    },error=>{
      this.presentToast(error);
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

  //提示框
  presentAlert(title,msg){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['确认']
    });

    alert.present();
  }

  //检查时间
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

  changeDate():void{
    let startTime=this.PZrecord.BeginTime.toString();
    let endTime=this.PZrecord.EndTime.toString();
    if(startTime>endTime)
    {
      this.presentAlert('时间选择错误','开始时间不能大于结束时间,请重新输入！');
      this.PZrecord.EndTime =this.PZrecord.BeginTime;
    }
  }

  changePlanDate():void {
    let planEndTime=this.PZrecord.SchEndTime.toString();
    let planStartTime=this.PZrecord.SchBeginTime.toString();
    if(planStartTime>planEndTime){
      this.presentAlert('时间选择错误','计划开始时间不能大于计划结束时间,请重新输入！');
      this.PZrecord.SchEndTime=this.PZrecord.SchBeginTime;
       }
   }

  addPhoto() {
    this.photoes = this.choosephoto.addPhoto();
  }

  deletePhoto(i:number){
    this.photoes = this.choosephoto.deletePhoto(i);
  }
}
