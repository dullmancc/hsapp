import { Component } from '@angular/core';
import {
  AlertController, IonicPage, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {HttpService} from "../../Service/HttpService";
import {Pangzhan} from "../../../Model/EPPangzhan";
import {Utils} from "../../../providers/Utils";
import {ApiUrl, ImgUrl} from "../../../providers/Constants";
import {ChoosePhotoService, Photo} from "../../../providers/ChoosePhotoService";
import {PzShiGongPage} from "../pz-shi-gong/pz-shi-gong";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PzSelectPeoplePage} from "../pz-select-people/pz-select-people";
import { PzCheckRecordPage} from "../pz-check-record/pz-check-record";
import {PZBelong} from "../../../Model/EPPZBelong";
import {ExitPzRecordPage} from "../exit-pz-record/exit-pz-record";
import {TabsPage} from "../../tabs/tabs";
import {PZConcrete} from "../../../Model/PZConcrete";
import {EPCSFile} from "../../../Model/EPCSFile";
import {ECUnit} from "../../../Model/ECUnit";

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

/** input 这个页面的参数为  1   保存后的 {'Pangzhan': item,'Type':1,'EmployeeID':this.me,'EProjectID':this.mypro.EProjectID,}
                           0  新建的 {'EmployeeID':this.me,'EProjectID':this.mypro.EProjectID,'PZType':data,'Type':0}
                            区别在与Type
    功能为  如为已保存的页面  则按照交班顺序排列交班人及信息，并显示PZBelong信息，点击每个交班人的Item即挑战至改页面 填写或查看

 **/
export class NormalPzPage {

  shigong = '待完善';
  jiancha = '待检查';
  curPZState={id:0,desc:'交班'};
  PZState = [{id:0,desc:'交班'},{id:1,desc:'完成'}];
  isRootPZ;
  isCheckOnly;

  //当前交班人
  transEmployee:{RealName:String,EmployeeID:String};
  employees;


  photoes:Photo[]=[];
  PZrecord:Pangzhan;
  PZConcrete:PZConcrete;

  PZtype;
  Type;
  EmployeeID;
  EProjectID;

  curECUnit:ECUnit;
  ECUnit;

  PZBelong;
  Pangzhans;
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
    this.Type = this.navParams.get('Type');
    this.PZtype=this.navParams.get('PZType');
    this.UserInfo = TabsPage.UserInfo.employees;
    this.curECUnit=new ECUnit();

    this.transEmployee = {RealName:"请选择", EmployeeID:""};

    this.InitPangzhan();
    //初始化


  }

  ionViewDidEnter(){
    // var t=document.getElementById('passOne');
    // var f=document.getElementById('fileLabel');
    // if(t!=null) t.style.color='#999999';
    // if(f!=null) f.style.color='#999999';
  }



  InitPangzhan(){
    //如果是新建
    console.log("Type:"+this.Type)
    if(this.Type==0){
      this.isRootPZ=true;
      this.isCheckOnly=false;
      this.http.get(ApiUrl+'Project/GetECUnit').subscribe(res=>{
        this.ECUnit = res;
      },error=>{
        alert(error);
      });
      this.PZrecord = new Pangzhan();
      this.PZrecord.PZRoot=0;
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

      this.GetEmployees();
    }
    else if(this.Type==1) {
      //如果不是新建
      this.isCheckOnly=false;
      this.PZrecord = this.navParams.get('Pangzhan');
      this.choosephoto.InitParams(this.PZrecord.EPCSID,this.EmployeeID);

      if(this.PZrecord.PZRoot==0){
        this.isRootPZ=true;
      }
      else{
        this.isRootPZ=false;
      }

      if(this.PZrecord.PZCheckRecords.length>0){
        this.jiancha="查看";
      }
      if(this.PZrecord.FindPromble && this.PZrecord.Suggestion){
        this.shigong="查看";
      }
      this.GetEmployees();

      this.http.get(ApiUrl+"Pangzhan/GetEPCSFile?EPCSID="+this.PZrecord.EPCSID).subscribe(data=>{
        if(data.length>0) {
          data.forEach(v2 => {
            let p: Photo = new Photo();
            p.ePfile = new EPCSFile(this.PZrecord.EPCSID, v2.FileUpPerson, v2.EPSecFileID, v2.FilePath);
            p.src = ImgUrl + v2.FilePath.substring(2);
            p.ePfile.EPSecFileID = v2.EPSecFileID;
            this.photoes.push(p);
          });
        }
        this.choosephoto.InitPhoto(this.photoes);
      });

    }else if(this.Type==2||this.Type==3){
      this.isCheckOnly=true;
      this.PZrecord = this.navParams.get('Pangzhan');
      this.choosephoto.InitParams(this.PZrecord.EPCSID,this.EmployeeID);

      if(this.PZrecord.PZCheckRecords.length>0){
        this.jiancha="查看";
      }
      if(this.PZrecord.FindPromble && this.PZrecord.Suggestion){
        this.shigong="查看";
      }
    }
    if((this.isRootPZ && this.Type>0) || !this.isRootPZ){
      this.PZBelong=this.PZrecord.PZBelong;
      this.curECUnit=this.PZBelong.ECUnit;
    }
  }

  GetWorkTime(index){
      var BeginTime = this.Pangzhans[index].BeginTime;
      BeginTime = BeginTime.replace('T',' ');
      var EndTime = this.Pangzhans[index].EndTime.replace('T',' ');
      return BeginTime+' 至 '+EndTime;
  }

  GetEmployees(){
    //获得与这个项目关联的Employees
    this.http.get(ApiUrl+'Project/getEmployees?EProjectId='+this.EProjectID).subscribe(res=>{
      this.employees = res;
      console.log(this.PZrecord);
      this.employees.forEach(v=>{
        if(this.Type!=3){
          if(this.PZrecord.EmployeeTransferID==v.EmployeeID){
            this.transEmployee = {RealName:v.RealName, EmployeeID:v.EmployeeID};
            console.log("RealName"+v.RealName);
          }
        }
      });
    },error=>{
      alert(error);
    });
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
          //console.log(data);
        }
      };
      if(this.PZtype=='PZConcrete'){
        //去除Newpz页
        //this.navCtrl.push(Newpz1Page,data);
      }else if(this.PZtype =='PZGeneral'){
        //去除jiaoban页
        //this.navCtrl.push(PzJiaoBanPage,data);
      }
    }else{
      let data = {
        'Pangzhan':i,
        'PZBelong':this.PZBelong,
        'EProjectId':this.EProjectID,
      };

      if(this.PZtype=='PZConcrete'){
        //this.navCtrl.push(Newpz1Page,data);
      }else if(this.PZtype =='PZGeneral'){
        this.navCtrl.push(ExitPzRecordPage,data);
      }
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
        //console.log(data);
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
        //console.log("callback data");
        //console.log(this.PZrecord);
        this.jiancha = '查看';
      }
    };
    this.navCtrl.push(PzCheckRecordPage,data);
  }
  addPeople(){
    var data={
      'employees':this.employees,
      callback:data=>{
        this.transEmployee = data;
        //console.log(this.transEmployee);
      }
    };
    this.navCtrl.push(PzSelectPeoplePage,data);
  }

  ionViewWillEnter() {
    //console.log(this.PZBelong);
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
      if(this.transEmployee.RealName=='请选择'){
        this.PZrecord.EmployeeTransferID = null;
      }else {
        this.PZrecord.EmployeeTransferID = this.transEmployee.EmployeeID;
      }
    }
    this.PZrecord.EPZState = this.curPZState.id;
    this.PZrecord.State = IsSubmit;

    this.httpc.post(ApiUrl+'Pangzhan/PostPangzhan',this.PZrecord,{headers:httphead}).subscribe((res:any)=>{
      console.log(res);
      console.log(res.ErrorMs);
      this.presentToast(res.ErrorMs);

      if(res.EPCSParentID!=-1){
        this.PZBelong.PZBelongId= res.PZBelongID;
        this.PZrecord.PZBelongId = res.PZBelongID;
        this.PZrecord.EPCSID = res.EPCSParentID;
        this.PZrecord.EPCSParent = res.EPCSParentID;

        let i=0;
        this.PZrecord.PZCheckRecords.forEach(V=>{
          V.PZCheckRecordID=res.PZCRIDs[i];
          i++;
        });

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
      //console.log('Dismissed toast');
    });

    toast.present();
  }

  changeDate():void{
    /*let startTime=this.PZrecord.BeginTime.toString();
    let endTime=this.PZrecord.EndTime.toString();
    if(startTime>endTime)
    {
      this.presentAlert('时间选择错误','开始时间不能大于结束时间,请重新输入！');
      this.PZrecord.EndTime =this.PZrecord.BeginTime;
    }*/
  }

  changePlanDate():void {
    /*
    let planEndTime=this.PZrecord.SchEndTime.toString();
    let planStartTime=this.PZrecord.SchBeginTime.toString();
    if(planStartTime>planEndTime){
      this.presentAlert('时间选择错误','计划开始时间不能大于计划结束时间,请重新输入！');
      this.PZrecord.SchEndTime=this.PZrecord.SchBeginTime;
    }*/
  }

  addPhoto() {
    if(this.Type<=1) {
      console.log("Type:"+this.Type);
      this.photoes = this.choosephoto.addPhoto();
    }
  }

  deletePhoto(i:number){
    if(this.Type<=1) {
      this.photoes = this.choosephoto.deletePhoto(i);
    }
  }

}
