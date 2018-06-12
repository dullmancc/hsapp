import { Component} from '@angular/core';
import {
  AlertController,
  IonicPage, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {HttpService} from "../../Service/HttpService";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {Pangzhan} from "../../../Model/EPPangzhan";
import {Utils} from "../../../providers/Utils";
import {ApiUrl} from "../../../providers/Constants";
import {ChoosePhotoService, Photo} from "../../../providers/ChoosePhotoService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { PzCheckRecordPage} from "../pz-check-record/pz-check-record";
import {PzShiGongPage} from "../pz-shi-gong/pz-shi-gong";
import {PzSelectPeoplePage} from "../pz-select-people/pz-select-people";
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
  shigong = '查看';
  jiancha = '查看';
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

  BeginTime ;
  EndTime;
  PZBelong;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl:AlertController,
              private http: HttpService,
              public httpc:HttpClient,
              public toastCtrl: ToastController,
              private choosephoto:ChoosePhotoService) {

    this.PZBelong = this.navParams.get('PZBelong');
    this.PZrecord = this.navParams.get('Pangzhan');
    this.EProjectID = this.navParams.get('EProjectId');

    this.BeginTime = this.PZBelong.BeginTime.replace('T',' ');
    this.EndTime = this.PZrecord.EndTime.replace('T',' ');

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

  addShiGong(){
    var data={
      'Pangzhan':this.PZrecord,
      'PZType':this.PZBelong.PZTypeID,
      'Type':1,
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
      'Type':1,
      callback:data=>{
        this.PZrecord = data.Pangzhan;
        console.log(data);
        this.jiancha = '查看';
      }
    };
    this.navCtrl.push(PzCheckRecordPage,data);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NormalPzPage');
  }

}

