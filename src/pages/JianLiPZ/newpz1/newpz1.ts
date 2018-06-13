import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, AlertController, ToastController
} from 'ionic-angular';
import {HttpService} from "../../Service/HttpService";
import {ApiUrl} from "../../../providers/Constants";
import {Utils} from "../../../providers/Utils";
import {Pangzhan} from "../../../Model/EPPangzhan";
import {ChoosePhotoService, Photo} from "../../../providers/ChoosePhotoService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PzShiGongPage} from "../pz-shi-gong/pz-shi-gong";
import {PzSelectPeoplePage} from "../pz-select-people/pz-select-people";
import {PzCheckRecordPage} from "../pz-check-record/pz-check-record";
import {TabsPage} from "../../tabs/tabs";
import {ExitPzRecordPage} from "../exit-pz-record/exit-pz-record";
import {PZBelong} from "../../../Model/EPPZBelong";
import {PzJiaoBanPage} from "../pz-jiao-ban/pz-jiao-ban";

@IonicPage()
@Component({
  selector: 'page-newpz1',
  templateUrl: 'newpz1.html',
})
export class Newpz1Page {

  shigong = '待完善';
  jiancha = '待检查';
  curPZState={id:0,desc:'交班'};
  PZState = [{id:0,desc:'交班'},{id:1,desc:'完成'}];


  //当前交班人
  curEmployee:any={RealName:'请选择'};
  employees;


  photoes:Photo[]=[];
  PZrecord:Pangzhan;

  PZtype;
  Type;
  EmployeeID;
  EProjectID;

  curECUnit;
  ECUnit;

  PZBelong;
  Flag = true;
  UserInfo ;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl:AlertController,
              private http: HttpService,
              public httpc:HttpClient,
              public toastCtrl: ToastController,
              private choosephoto:ChoosePhotoService) {
    this.EmployeeID = this.navParams.get('EmployeeID');
    this.EProjectID = this.navParams.get('EProjectID');
    //console.log(this.EProjectID);
    this.PZtype = this.navParams.get('PZType');
    this.Type = this.navParams.get('Type');
    this.UserInfo = TabsPage.UserInfo.employees;;

    //如果是新建
    if(this.Type==0){

      this.PZrecord = new Pangzhan();
      //新建PZBelong.Push 防止逻辑错误，实则并不Post ,POST pangzhan
      this.PZBelong = new PZBelong();
      this.PZBelong.Pangzhans.push(this.PZrecord);

      this.PZBelong.EProjectID = this.EProjectID;
      this.PZBelong.PZTypeID = this.PZtype;
      //初始化
      this.PZrecord.PZBelong.EProjectID = this.EProjectID;
      this.PZrecord.PZBelong.PZTypeID = this.PZtype;
      this.PZrecord.EPCSParent.EmployeeID = this.EmployeeID;
      this.PZrecord.EPCSParent.EProjectID = this.EProjectID;

    }else if(this.Type==1) {
      //如果不是新建
      this.PZBelong = this.navParams.get('Pangzhan');
      //Flag是否新建Pangzhan
      //this.Flag = true;
      //如果已经填过 有保存的Pangzhan表单则不用新建
      this.PZBelong.Pangzhans.forEach(V=>{
        if(V.State==0){
          this.PZrecord = V;
          this.Flag = false;
        }
      });
      //如无则新建
      if(this.Flag){
        this.PZrecord = new Pangzhan();
        this.PZrecord.PZBelongId = this.PZBelong.PZBelongId;
        let pzb = new PZBelong();
        pzb.PZBelongId = this.PZBelong.PZBelongId;
        pzb.EProjectID = this.PZBelong.EProjectID;
        pzb.PZBelongName = this.PZBelong.PZBelongName;
        pzb.Process = this.PZBelong.Process;
        pzb.Part = this.PZBelong.Part;
        pzb.BeginTime = this.PZBelong.BeginTime;
        pzb.ECUnitID = this.PZBelong.ECUnitID;
        pzb.PZTypeID = this.PZBelong.PZTypeID;

        this.PZrecord.PZBelong = pzb;
        this.PZBelong.Pangzhans.push(this.PZrecord);
      }
    }else if(this.Type==2){
      this.PZBelong = this.navParams.get('Pangzhan');
    }

    this.http.get(ApiUrl+'Project/GetECUnit').subscribe(res=>{
      this.ECUnit = res;
      this.ECUnit.forEach(v=>{
        if(v.ECUnitID==this.PZBelong.ECUnitID){
          this.curECUnit = v;
        }
      });
    },error=>{
      alert(error);
    });

    //获得与这个项目关联的Employees
    this.http.get(ApiUrl+'Project/getEmployees?EProjectId='+this.EProjectID).subscribe(res=>{
      this.employees = res;
      this.employees.forEach(v=>{
        if(this.Type!=2){
          if(this.PZrecord.EmployeeTransferID==v.EmployeeID){
            this.curEmployee = v;
          }
        }
      });
    },error=>{
      alert(error);
    });

    //初始化
    this.choosephoto.InitPhoto(this.photoes);

    console.log(this.PZBelong);
    console.log(this.PZrecord);
  }

  GetWorkTime(index){
    if(index==0){
      var BeginTime = this.PZBelong.BeginTime;
      BeginTime = BeginTime.replace('T',' ');
      var EndTime = this.PZBelong.Pangzhans[index].EndTime.replace('T',' ');
      return BeginTime+' 至 '+EndTime;
    }else {
      var BeginTime = this.PZBelong.Pangzhans[index-1].EndTime;
      BeginTime = BeginTime.replace('T',' ');
      var EndTime = this.PZBelong.Pangzhans[index].EndTime.replace('T',' ');
      return BeginTime+' 至 '+EndTime;
    }
  }

  goItem(i,ii){
    if(i.State==0){
      let data = {
        'Pangzhan':i,
        'PZBelong':this.PZBelong,
        'EProjectId':this.EProjectID,
        callback:data=>{
          this.PZBelong = data.PZBelong;
          data.Pangzhan.EPCSParent = this.PZBelong.Pangzhans[ii].EPCSParent;
          this.PZBelong.Pangzhans[ii] = data.Pangzhan;
          console.log(data);
        }
      };

      this.navCtrl.push(PzJiaoBanPage,data);
    }else{
      let data = {
        'Pangzhan':i,
        'PZBelong':this.PZBelong,
        'EProjectId':this.EProjectID,
      };

      this.navCtrl.push(ExitPzRecordPage,data);
    }
  }


  goBack(){
    this.navCtrl.pop();
  }

  updateCucumber(e1:any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  compare2Fn(e1: any,e2:any): boolean {
    return e1 && e2 ? e1.EmployeeID === e2.EmployeeID : e1 === e2;
  }

  compare3Fn(e1:any, e2: any): boolean {
    return e1 && e2 ? e1.ECUnitID === e2.ECUnitID : e1 === e2;
  }

  updateECUnit(){
    this.PZBelong.ECUnitID = this.curECUnit.ECUnitID;
  }

  addShiGong(){
    var data={
      'Pangzhan':this.PZrecord,
      'PZType':this.PZtype,
      'Type':0,
      callback:data=>{
        this.PZrecord = data;
        console.log(data);
        this.shigong = '查看';
      }
    };
    this.navCtrl.push(PzShiGongPage,data);
  }

  addJianCha(){
    var data={
      'Pangzhan':this.PZrecord,
      'PZType':this.PZtype,
      'Type':0,
      callback:data=>{
        this.PZrecord = data.Pangzhan;
        console.log(data);
        this.jiancha = '查看';
      }
    };
    this.navCtrl.push(PzCheckRecordPage,data);
  }
  addPeople(){
    var data={
      'employees':this.employees,
      callback:data=>{
        this.curEmployee = data;
        console.log(this.curEmployee);
      }
    };
    this.navCtrl.push(PzSelectPeoplePage,data);
  }

  ionViewWillEnter() {
    console.log(this.PZBelong);
  }


  save(IsSubmit){
    var httphead = new HttpHeaders({"Content-Type":'application/json',"Authorization":'Bearer '+sessionStorage.getItem('accessToken')});
    this.PZrecord.State = IsSubmit;
    //检查项出现的问题描述和解决方案合并到Pangzhan中
    this.PZrecord.PZBelong = this.PZBelong;
    this.PZrecord.PZBelong.Pangzhans = null;
    if(typeof this.curECUnit === 'undefined')
    {
      this.PZrecord.PZBelong.ECUnitID = null;
    } else {
      this.PZrecord.PZBelong.ECUnitID = this.curECUnit.ECUnitID;
    }
    if(this.curPZState.id==1){
      this.PZrecord.EmployeeTransferID = null;
    }else {
      if(this.curEmployee.RealName=='请选择'){
        this.PZrecord.EmployeeTransferID = null;
      }else {
        this.PZrecord.EmployeeTransferID = this.curEmployee.EmployeeID;
      }
    }
    this.PZrecord.EPZState = this.curPZState.id;
    this.PZrecord.State = IsSubmit;


    this.httpc.post('http://localhost:1857/api/pangzhan/PostPangzhan',this.PZrecord,{headers:httphead}).subscribe((res:any)=>{
      console.log(res);
      this.presentToast(res.ErrorMs);

      if(res.EPCSParentID!=-1){
        this.PZBelong.PZBelongId= res.ErrorCode;
        this.PZrecord.PZBelongId = res.ErrorCode;
        this.PZrecord.EPCSID = res.EPCSParentID;
        this.PZrecord.EPCSParent = res.EPCSParentID;
        this.choosephoto.InitParams(res.EPCSParentID,this.EmployeeID);
        if(IsSubmit==1){
          this.navCtrl.pop();
        }
      }
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

  addPhoto() {
    this.photoes = this.choosephoto.addPhoto();
  }

  deletePhoto(i:number){
    this.photoes = this.choosephoto.deletePhoto(i);
  }

}
