import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {PzCheckRecordPage} from "../../../JianLiPZ/pz-check-record/pz-check-record";
import {SubProjectPage} from "../sub-project/sub-project";
import {HttpService} from "../../../Service/HttpService";
import {ApiUrl} from "../../../../providers/Constants";
import {AcceptancePage} from "../acceptance/acceptance";
import {AcceptanceRecord, Inspection} from "../../../../Model/Inspection";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PZCheckRecord} from "../../../../Model/PZConcreteSlumpRecord";

/**
 * Generated class for the InspectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage()
@Component({
  selector: 'page-inspection',
  templateUrl: 'inspection.html',
})
export class InspectionPage {
  EProjectID;
  EmployeeID;
  EPCheckParent;
  ECUnitName;
  PersonReportName;
  SubProj:{Name:string,SubDivEngineeringID:number,SubEngineeringID:number};
  InspectionTypeList:Array<{InspectionTypeName:string, InspectionTypeID:number, SubEngineeringID:number}>;
  CurInspectionType:{InspectionTypeName:string, InspectionTypeID:number, SubEngineeringID:number, SubEngineering:any};
  CurInspection:Inspection;
  IsSelecting:boolean;
  IsShowingMAcList:boolean;
  IsShowingJAcList:boolean;
  MAcList;
  JAcList;
  State;
  isReadOnly;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpService,
              public httpc:HttpClient,
              private alertCtrl: AlertController,
              public toastCtrl: ToastController) {

    this.SubProj={Name:"请选择", SubDivEngineeringID:0, SubEngineeringID:0};
    this.CurInspectionType={InspectionTypeName:"请先选择分项工程", InspectionTypeID:0, SubEngineeringID: 0, SubEngineering:null};
    this.IsSelecting=false;
    this.IsShowingMAcList=true;
    this.IsShowingJAcList=true;
    this.EProjectID=this.navParams.get("EProjectID");
    this.EmployeeID=this.navParams.get("EmployeeID");
    this.State=this.navParams.get("State");
    this.EPCheckParent=this.navParams.get("EPCheckParent");

    this.GetECUnitName();
    this.GetPersonReprotName();
    this.InitInspection();
  }

  goBack(){
    if(!this.IsSelecting) this.navCtrl.pop();
    else this.IsSelecting=false;
  }

  InitInspection(){
    if(this.State>-1){
      //不是新建
      var ig=this.navParams.get("InspectionGroup");
      console.log(ig);
      this.CurInspection=ig.Inspection;
      this.CurInspectionType=ig.InspectionType;
      this.SubProj=this.CurInspectionType.SubEngineering;

      this.GetAcceptances();

      if(this.State==1) this.isReadOnly=true;
      else  this.isReadOnly=false;
    }
    else{
      //新建
      this.CurInspection=new Inspection();
      this.CurInspection.InspectionID="";
      this.CurInspection.ECUnitReportInspectionID=this.EPCheckParent.EPCheckID;
      this.CurInspection.InspectionTypeID=this.CurInspectionType.InspectionTypeID;
      this.CurInspection.DivEngineeringID=0;
      this.CurInspection.SubDivEngineeringID=0;
      this.CurInspection.SubEngineeringID=0;
      this.CurInspection.EProjectID=this.EProjectID;
      this.CurInspection.RecorderID=this.EmployeeID;
      this.CurInspection.ECUnitEmployeeID=this.EPCheckParent.EmployeeID;
      this.CurInspection.State=-1;
      this.CurInspection.AcceptanceRecords=[];
    }
  }

  GetECUnitName(){
    this.http.get(ApiUrl+"UserInfo/GetECUnitName?ECUnitID="+this.EPCheckParent.ECUnitID).subscribe(data=>{
      this.ECUnitName=data;
    });
  }

  GetPersonReprotName(){
    this.http.get(ApiUrl+"UserInfo/GetEmployeeName?EmployeeID="+this.EPCheckParent.EmployeeID).subscribe(data=>{
      this.PersonReportName=data;
    });
  }

  GetInspections(){
    //根据分项工程获取检验批类型列表
    this.http.get(ApiUrl+"Inspection/GetInspectionTypes?SubProjID="+this.SubProj.SubEngineeringID).subscribe(data=>{
      this.InspectionTypeList=[];
      this.InspectionTypeList=data;
    });
  }

  GetAcceptances(){
    //根据检验批类型获取相关验收项目
    if(this.State==-1){
      //新建检验批
      this.http.get(ApiUrl+"Inspection/GetAcceptances?InspectionTypeID="+this.CurInspectionType.InspectionTypeID).subscribe(data=>{
        this.MAcList=data.Major;
        this.JAcList=data.Junior;
        this.MAcList.forEach(ag=>{
          this.CurInspection.AcceptanceRecords.push(ag.AcceptanceRecord);
        });
        this.JAcList.forEach(ag=>{
          this.CurInspection.AcceptanceRecords.push(ag.AcceptanceRecord);
        });
      });
    }
    else {
      //已有检验批
      this.http.get(ApiUrl+"Inspection/GetAcceptancesByInspection?InspectionID="+this.CurInspection.InspectionID).subscribe(data=>{
        this.MAcList=data.Major;
        this.JAcList=data.Junior;
        this.MAcList.forEach(ag=>{
          this.CurInspection.AcceptanceRecords.push(ag.AcceptanceRecord);
        });
        this.JAcList.forEach(ag=>{
          this.CurInspection.AcceptanceRecords.push(ag.AcceptanceRecord);
        });
      });
    }

  }

  ShowInspections(){
    this.GetInspections();
    this.IsSelecting=true;
  }
  ShowMAcList(){
    this.IsShowingMAcList=!this.IsShowingMAcList;
  }
  ShowJAcList(){
    this.IsShowingJAcList=!this.IsShowingJAcList;
  }

  SelectSubProj(){
    var data={
      'DivProjID':this.CurInspection.DivEngineeringID,
      'SubDivProjID':this.CurInspection.SubDivEngineeringID,
      'State':this.State,
      callback:data=>{
        this.CurInspection.DivEngineeringID = data.DivProjID;
        this.CurInspection.SubDivEngineeringID = data.SubDivProjID;
        this.SubProj=data.SubProj;
        this.CurInspection.SubEngineeringID=this.SubProj.SubEngineeringID;
      }
    };
    this.navCtrl.push(SubProjectPage,data);
  }

  SelectInspection(inspection){
    this.CurInspectionType=inspection;
    this.CurInspection.InspectionTypeID=this.CurInspectionType.InspectionTypeID;
    this.IsSelecting=false;
    this.GetAcceptances();
  }

  CheckUp(acceptanceGroup){
    let data={
      'AcceptanceGroup':acceptanceGroup,
      'Inspection':this.CurInspection,
      'State':this.CurInspection.State,
      callback:data=>{
        acceptanceGroup.AcceptanceRecord=data;
        console.log(data);
        this.ReplaceAcceptance(data);
      }
    };
    this.navCtrl.push(AcceptancePage,data);
  }

  save(submit){
    if(submit==1 && !this.Review()){
      let alert = this.alertCtrl.create({
        title: '存在未确认的验收项目',
        message: '是否继续提交，提交后将无法修改',
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            handler: data => {

            }
          },
          {
            text: '确定',
            handler: data => {
              var httphead = new HttpHeaders({"Content-Type":'application/json',"Authorization":'Bearer '+sessionStorage.getItem('accessToken')});
              this.CurInspection.State=submit;
              this.httpc.post(ApiUrl+"Inspection/PostInspectionRecord",this.CurInspection,{headers:httphead}).subscribe((res:any)=>{
                this.CurInspection.InspectionID=res.InspectionID;

                this.presentToast(res.ErrorMs);
              },error=>{
                this.presentToast(error.toString());
              });
            }
          }
        ]
      });
      alert.present();
    }
    else{
      var httphead = new HttpHeaders({"Content-Type":'application/json',"Authorization":'Bearer '+sessionStorage.getItem('accessToken')});
      this.CurInspection.State=submit;
      this.httpc.post(ApiUrl+"Inspection/PostInspectionRecord",this.CurInspection,{headers:httphead}).subscribe((res:any)=>{
        this.CurInspection.InspectionID=res.InspectionID;

        this.presentToast(res.ErrorMs);
      },error=>{
        this.presentToast(error.toString());
      });
    }

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  }

  ReplaceAcceptance(new_acc:AcceptanceRecord){
    if(this.CurInspection.AcceptanceRecords){
      this.CurInspection.AcceptanceRecords.some(ar=>{
        if(ar.AcceptanceID==new_acc.AcceptanceID){
          new_acc.InspectionID=ar.InspectionID;
          ar=new_acc;
          return true;
        }
      });
    }
  }

  Review(){
    let fulfilment=true;

    this.MAcList.some(a=>{
      if(!a.AcceptanceRecord.IsConfirmed){
        fulfilment=false;
        return true;
      }
    });

    if(fulfilment){
      this.JAcList.some(a=>{
        if(!a.AcceptanceRecord.IsConfirmed){
          fulfilment=false;
          return true;
        }
      });
    }

    return fulfilment;
  }

}
