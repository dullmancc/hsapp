import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {PzSelectPeoplePage} from "../pz-select-people/pz-select-people";
import {ChoosePhotoService, Photo} from "../../../providers/ChoosePhotoService";
import {PzShiGongPage} from "../pz-shi-gong/pz-shi-gong";
import {ApiUrl} from "../../../providers/Constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpService} from "../../Service/HttpService";
import {Pangzhan} from "../../../Model/EPPangzhan";
import { PzCheckRecordPage} from "../pz-check-record/pz-check-record";
import {PZBelong} from "../../../Model/EPPZBelong";

/**
 * Generated class for the PzJiaoBanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pz-jiao-ban',
  templateUrl: 'pz-jiao-ban.html',
})
export class PzJiaoBanPage {

  shigong = '待完善';
  jiancha = '待检查';
  curPZState={id:0,desc:'交班'};
  PZState = [{id:0,desc:'交班'},{id:1,desc:'完成'}];


  //当前交班人
  curEmployee:any={RealName:'请选择'};
  employees;


  photoes:Photo[]=[];
  PZrecord:Pangzhan;
  callback;
  Type;
  EmployeeID;
  EProjectID;

  curECUnit;
  ECUnit;

  PZBelong;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl:AlertController,
              private http: HttpService,
              public httpc:HttpClient,
              public toastCtrl: ToastController,
              private choosephoto:ChoosePhotoService) {
    //this.EmployeeID = this.navParams.get('EmployeeID');
    this.EProjectID = this.navParams.get('EProjectId');
    //this.PZtype = this.navParams.get('PZType');
    this.callback = this.navParams.get('callback');
    this.PZrecord = this.navParams.get('Pangzhan');
    this.PZBelong = this.navParams.get('PZBelong');

    if(this.PZrecord.PZBelong==null){
      this.PZrecord.PZBelong = this.PZBelong;
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
        if(this.PZrecord.EmployeeTransferID==v.EmployeeID){
          this.curEmployee = v;
        }
      });
    },error=>{
      alert(error);
    });

    //初始化
    this.initPhoto();

    if(this.PZrecord.EPCSID!=''){
      this.choosephoto.InitParams(this.PZrecord.EPCSID,this.EmployeeID);
    }
  }

  initPhoto(){
    let ePfiles = this.PZrecord.EPCSParent.EPCSFiles;
    this.photoes = [];
    for(var i = 0;i<ePfiles.length;i++){
      var p = new  Photo();
      var tupian = ePfiles[i].FileName.substr(ePfiles[i].FileName.lastIndexOf('.'));
      if(tupian=='.png'||tupian=='.jpg'||tupian=='.gif'||tupian=='.tiff'||tupian=='.svg'){
        p.src = ApiUrl.slice(0,ApiUrl.length-4)+ ePfiles[i].FilePath.substring(2);
        p.isPhoto = true;
      }else{
        p.src = ePfiles[i].FileName;
        p.isPhoto = false;
      }
      p.isupload = true;
      this.photoes.push(p);
      this.photoes[i].ePfile = ePfiles[i];
    }
    this.choosephoto.InitPhoto(this.photoes);
  }

  goBack(){
    //this.callback()
    this.navCtrl.pop();
  }

  updateCucumber(e1:any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }
  updatePZState(){
    this.PZrecord.EPZState = this.curPZState.id;
  }

  compare2Fn(e1: any,e2:any): boolean {
    return e1 && e2 ? e1.EmployeeID === e2.EmployeeID : e1 === e2;
  }

  compare3Fn(e1:any, e2: any): boolean {
    return e1 && e2 ? e1.ECUnitID === e2.ECUnitID : e1 === e2;
  }

  addShiGong(){
    var data={
      'Pangzhan':this.PZrecord,
      'PZType':this.PZBelong.PZTypeID,
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
        this.PZrecord.EmployeeTransferID = this.curEmployee.EmployeeID;
        console.log(this.curEmployee);
      }
    };
    this.navCtrl.push(PzSelectPeoplePage,data);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NormalPzPage');
  }

  save(IsSubmit){
    var httphead = new HttpHeaders({"Content-Type":'application/json',"Authorization":'Bearer '+sessionStorage.getItem('accessToken')});
    this.PZrecord.State = IsSubmit;

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

    let pzb = new PZBelong();
    pzb.PZTypeID = this.PZBelong.PZTypeID;
    pzb.BeginTime = this.PZBelong.BeginTime;
    pzb.ECUnitID = this.PZBelong.ECUnitID;
    pzb.Part = this.PZBelong.Part;
    pzb.Process = this.PZBelong.Process;
    pzb.EProjectID = this.PZBelong.EProjectID;
    pzb.Pangzhans = null;
    pzb.PZBelongName = this.PZBelong.PZBelongName;
    pzb.PZBelongId = this.PZBelong.PZBelongId;
    this.PZrecord.PZBelong = pzb;

    this.httpc.post('http://localhost:1857/api/pangzhan/PostPangzhan',this.PZrecord,{headers:httphead}).subscribe((res:any)=>{
      console.log(res);
      this.presentToast(res.ErrorMs);

      if(res.EPCSParentID!=-1){
        this.PZrecord.EPCSID = res.EPCSParentID;
        this.PZrecord.EPCSParent.EPCSID = res.EPCSParentID;
        this.choosephoto.InitParams(res.EPCSParentID,this.EmployeeID);

        let dt = {
          'Pangzhan':this.PZrecord,
          'PZBelong':this.PZBelong,
        };
        this.callback(dt);
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
