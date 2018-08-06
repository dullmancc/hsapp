import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {PzCheckRecordPage} from "../../../JianLiPZ/pz-check-record/pz-check-record";
import {SubProjectPage} from "../sub-project/sub-project";
import {HttpService} from "../../../Service/HttpService";
import {ApiUrl} from "../../../../providers/Constants";
import {AcceptancePage} from "../acceptance/acceptance";
import {Inspection} from "../../../../Model/Inspection";
import {HttpClient, HttpHeaders} from "@angular/common/http";

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
  InspectionTypeList:Array<{InspectionTypeName:string,InspectionTypeID:number,SubEngineeringID:number}>;
  CurInspectionType:{InspectionTypeName:string,InspectionTypeID:number,SubEngineeringID:number};
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
              public toastCtrl: ToastController) {

    this.SubProj={Name:"请选择", SubDivEngineeringID:0, SubEngineeringID:0};
    this.CurInspectionType={InspectionTypeName:"请先选择分项工程", InspectionTypeID:0, SubEngineeringID: 0};
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
      this.CurInspection=this.navParams.get("InspectionRecord");

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
      console.log(this.CurInspection);
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
        console.log(data);
      });
    }
    else {
      //已有检验批
      this.http.get(ApiUrl+"Inspection/GetAcceptancesByInspection?InspectionID="+this.CurInspection.InspectionID).subscribe(data=>{
        this.MAcList=data.Major;
        this.JAcList=data.Junior;
      });
    }

  }

  ShowInspections(){
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
      'SubProjID':this.CurInspection.SubEngineeringID,
      'State':this.State,
      callback:data=>{
        this.CurInspection.DivEngineeringID = data.DivProjID;
        this.CurInspection.SubDivEngineeringID = data.SubDivProjID;
        this.SubProj=data.SubProj;
        this.CurInspection.SubEngineeringID=this.SubProj.SubEngineeringID;
        this.GetInspections();
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
    console.log(acceptanceGroup);
    var data={
      'AcceptanceGroup':acceptanceGroup,
      'InpectionID':this.CurInspection.InspectionID,
      'State':this.CurInspection.State,
      callback:data=>{
        console.log(this.CurInspection);
        acceptanceGroup.AcceptanceRecord=data;
        this.CurInspection.AcceptanceRecords.push(data);
      }
    };
    this.navCtrl.push(AcceptancePage,data);
  }

  save(submit){
    var httphead = new HttpHeaders({"Content-Type":'application/json',"Authorization":'Bearer '+sessionStorage.getItem('accessToken')});
    this.CurInspection.State=submit;
    this.httpc.post(ApiUrl+"Inspection/PostInspectionRecord",this.CurInspection,{headers:httphead}).subscribe((res:any)=>{
      this.CurInspection.InspectionID=res.InspectionID;

    },error=>{
      this.presentToast(error.toString());
    });
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  }
}
