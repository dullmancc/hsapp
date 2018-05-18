import { Component } from '@angular/core';
import {
  AlertController, IonicPage, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {HttpService} from "../../Service/HttpService";
import {PzRecord} from "../../../Model/EPPangzhan";
import {Utils} from "../../../providers/Utils";
import {ApiUrl} from "../../../providers/Constants";
import {ChoosePhotoService, Photo} from "../../../providers/ChoosePhotoService";

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
  photoes:Photo[]=[];
  PZrecord:PzRecord;
  Pangzhanid:string;
  PZBL;
  PZtype;
  btcs;
  btcs1;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl:AlertController,
              private http: HttpService,
              public toastCtrl: ToastController,
              private choosephoto:ChoosePhotoService) {
    this.PZrecord = new PzRecord();
    this.PZrecord.Employee_EmployeeID = this.navParams.get('userid');
    this.PZBL = this.navParams.get('pzbl');
    this.PZrecord.PZBelongId =  this.PZBL.PZBelongId;
    this.PZtype = this.navParams.get('type');


    //判断该页面为查看页面 or 保存页面
    if(this.PZtype>0){
      this.btcs = 'none';

    }else {
      this.btcs1 = 'none';
    }


    //初始化
    this.choosephoto.InitPhoto(this.photoes);
  }

  goBack(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NormalPzPage');
  }
  save(IsSubmit){
    this.PZrecord.SupervisorCase = '';
    this.PZrecord.State = IsSubmit;
    this.PZrecord.Part = this.PZrecord.Part+'层结构剪力墙、柱';
    this.PZrecord.Process =  this.PZrecord.Process+'层梁、板混凝土浇筑';


    this.checkTime();
    var data = Utils.ParamsToString(this.PZrecord);

    this.http.post(ApiUrl+'Pangzhan/PostPangzhan',data).subscribe(res=>{
      this.presentToast(res.ErrorMs);
      console.log(res.Pangzhanid);
      this.Pangzhanid = res.Pangzhanid;
      this.choosephoto.InitParams(res.EPCSParentID,this.PZrecord.Employee_EmployeeID);
    },error=>{
      this.presentToast(error.toString());
    });
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
