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
// import {ChoosePhotoService, Photo} from "../../../../providers/ChoosePhotoService";
import {Photo, PhotoService} from "../../../../providers/PhotoService";
import {Utils} from "../../../../providers/Utils";
import {_document} from "@angular/platform-browser/src/browser";
import {JQueryStyleEventEmitter} from "rxjs/observable/FromEventObservable";
import {InspectionListPage} from "../inspection-list/inspection-list";

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
  photoes:Photo[]=[];

  isReadOnly;

  ImgSrc;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpService,
              private httpc:HttpClient,
              private alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private choosephoto:PhotoService) {

    this.SubProj={Name:"请选择", SubDivEngineeringID:0, SubEngineeringID:0};
    this.CurInspectionType={InspectionTypeName:"请先选择分项工程", InspectionTypeID:0, SubEngineeringID: 0, SubEngineering:null};
    this.IsSelecting=false;
    this.IsShowingMAcList=true;
    this.IsShowingJAcList=true;
    this.EProjectID=this.navParams.get("EProjectID");
    this.EmployeeID=this.navParams.get("EmployeeID");
    this.State=this.navParams.get("State");
    this.EPCheckParent=this.navParams.get("EPCheckParent");
    //this.ImgSrc='../../../../assets/imgs/test.png';

    this.GetECUnitName();
    this.GetPersonReprotName();
    this.InitInspection();
    if(this.State==1) this.isReadOnly=true;
  }

  goBack(){
    if(!this.IsSelecting) this.navCtrl.pop();
    else this.IsSelecting=false;
  }

  InitInspection(){
    console.log(this.State)
    if(this.State>-1){
      //不是新建
      var ig=this.navParams.get("InspectionGroup");
      console.log(ig);
      this.CurInspection=ig.Inspection;
      this.CurInspectionType=ig.InspectionType;
      this.SubProj=this.CurInspectionType.SubEngineering;

      this.GetAcceptances();
      this.GetPhotoes();
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
        this.MAcList.forEach(a=>{
          this.CurInspection.AcceptanceRecords.push(a);
        });
        this.JAcList.forEach(a=>{
          this.CurInspection.AcceptanceRecords.push(a);
        });
      });
    }
    else {
      //已有检验批
      this.SortMJ();
    }

  }

  GetPhotoes(){
    this.http.get(ApiUrl+"File/GetFiles?ID="+this.CurInspection.InspectionID).subscribe(res=>{
      let base64="data:image/jpeg;base64,";
      res.forEach(file=>{
        var p=new Photo();
        p.FileID=file.PhotoID;
        p.type=file.PhotoType;
        p.src=base64+file.Photo;
        p.hasUploaded=true;
        this.photoes.push(p);
      });
      this.choosephoto.InitPhoto(this.photoes);
    });
  }

  ShowInspections(){
    if(!this.isReadOnly){
      this.GetInspections();
      this.IsSelecting=true;
    }

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

  CheckUp(acceptanceRecord){
    let data={
      'AcceptanceRecord':acceptanceRecord,
      'InspectionID':this.CurInspection.InspectionID,
      'State':this.CurInspection.State,
      callback:data=>{
        // acceptanceRecord=data;
        console.log(data);
        this.ReplaceAcceptance(data);
      }
    };
    this.navCtrl.push(AcceptancePage,data);
  }

  save(state){
    var httphead = new HttpHeaders({"Content-Type":'application/json',"Authorization":'Bearer '+sessionStorage.getItem('accessToken')});
    this.CurInspection.State=state;
    if(state==1 && !this.Review()){
      let alert = this.alertCtrl.create({
        title: '存在待确认的验收项目',
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
              this.httpc.post(ApiUrl+"Inspection/PostInspectionRecord", this.CurInspection, {headers:httphead}).subscribe((res:any)=>{
                this.CurInspection.InspectionID=res.InspectionID;
                this.choosephoto.paramValue=res.InspectionID;

                this.presentToast(res.ErrorMs);

                if (state==1) this.navCtrl.pop();
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
      this.httpc.post(ApiUrl+"Inspection/PostInspectionRecord", this.CurInspection, {headers:httphead}).subscribe((res:any)=>{
        this.choosephoto.SetParams(this.CurInspection.InspectionID,'PostInspectionFile')

        this.presentToast(res.ErrorMs);
        if (state==1) this.navCtrl.pop();
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
    toast.present();
  }

  ReplaceAcceptance(new_acc:AcceptanceRecord){
    if(this.CurInspection.AcceptanceRecords){
      for(var i=0;i<this.CurInspection.AcceptanceRecords.length;i++){
        if(this.CurInspection.AcceptanceRecords[i].AcceptanceID==new_acc.AcceptanceID){
          this.CurInspection.AcceptanceRecords[i].MinSampleNum=new_acc.MinSampleNum;
          this.CurInspection.AcceptanceRecords[i].RealSampleNum=new_acc.RealSampleNum;
          this.CurInspection.AcceptanceRecords[i].CheckRecord=new_acc.CheckRecord;
          this.CurInspection.AcceptanceRecords[i].CheckResult=new_acc.CheckResult;
          this.CurInspection.AcceptanceRecords[i].IsConfirmed=new_acc.IsConfirmed;
          break;
        }
      }
    }
  }

  //全部确认返回true，存在未确认返回false
  Review(){
    let fulfilment=true;

    this.CurInspection.AcceptanceRecords.some(ar=>{
      if(!ar.IsConfirmed){
        fulfilment=false;
        return true;
      }
    });

    return fulfilment;
  }

  SortMJ(){
    this.MAcList=[];
    this.JAcList=[];
    this.CurInspection.AcceptanceRecords.forEach(ar=>{
      if(ar.Acceptance.AcceptanceType==0){
        this.MAcList.push(ar);
      }
      else if(ar.Acceptance.AcceptanceType==1){
        this.JAcList.push(ar);
      }
    });
  }

  addPhoto() {
    if (this.State < 1) {
      this.choosephoto.SetParams(this.CurInspection.InspectionID,'PostInspectionFile');
      console.log(this.choosephoto);
      this.photoes = this.choosephoto.AddPhotoes();
    }
  }

  deletePhoto(i:number) {
    if (this.State < 1) {
      this.choosephoto.SetParams(this.CurInspection.InspectionID,'DeleteFile')
      this.choosephoto.deletePhoto(i);
    }
  }

  // pcAddPhoto(){
  //   //var i= document.getElementById("img");
  //   var image=$("#img")[0].files[0];
  //   var reader=new FileReader();
  //   var imgFile;
  //   // reader.onload=function(e) {
  //   //   alert('文件读取完成');
  //   //   imgFile = e.target.result;//Base64
  //   //   console.log(imgFile);
  //   //
  //   // };
  //   //
  //   //
  //   // var base=reader.readAsDataURL(image);
  //   let data=Utils.ParamsToString(image);
  //   //let data=image;
  //   console.log(image);
  //   //console.log(base);
  //   console.log(data);
  //   //
  //   if(data){
  //     this.http.post(ApiUrl+"File/PostInspectionFile?ID="+this.CurInspection.InspectionID,data).subscribe(response=>{
  //       console.log(response);
  //     })
  //   }
  //
  // }


}
