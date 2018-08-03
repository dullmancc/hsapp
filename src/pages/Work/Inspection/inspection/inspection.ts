import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PzCheckRecordPage} from "../../../JianLiPZ/pz-check-record/pz-check-record";
import {SubProjectPage} from "../sub-project/sub-project";
import {HttpService} from "../../../Service/HttpService";
import {ApiUrl} from "../../../../providers/Constants";

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
  DivProjID;
  SubDivProjID;
  SubProj:{Name:string,SubDivEngineeringID:number,SubEngineeringID:number};
  InspectionList:Array<{InspectionTypeName:string,InspectionTypeID:number,SubEngineeringID:number}>;
  CurInspection:{InspectionTypeName:string,InspectionTypeID:number,SubEngineeringID:number};
  IsSelecting:boolean;
  AccepttanceList;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpService) {
    this.SubProj={Name:"请选择", SubDivEngineeringID:0, SubEngineeringID:0};
    this.CurInspection={InspectionTypeName:"请先选择分项工程", InspectionTypeID:0, SubEngineeringID: 0};
    this.IsSelecting=false;
  }

  goBack(){
    if(!this.IsSelecting) this.navCtrl.pop();
    else this.IsSelecting=false;
  }

  GetInspections(){
    this.http.get(ApiUrl+"Inspection/GetInspectionTypes?SubProjID="+this.SubProj.SubEngineeringID).subscribe(data=>{
      this.InspectionList=[];
      this.InspectionList=data;
    });
  }

  GetAcceptances(){
    this.http.get(ApiUrl+"Inspection/GetAcceptances?InspectionTypeID="+this.CurInspection.InspectionTypeID).subscribe(data=>{
      this.AccepttanceList=[];
      this.AccepttanceList=data;
      console.log(data);
    });
  }

  SelectSubProj(){
    var data={
      'DivProjID':this.DivProjID,
      'SubDivProjID':this.SubDivProjID,
      'SubProjID':this.SubProj.SubEngineeringID,
      callback:data=>{
        this.DivProjID = data.DivProjID;
        this.SubDivProjID = data.SubDivProjID;
        this.SubProj=data.SubProj;
        this.GetInspections();
      }
    };
    this.navCtrl.push(SubProjectPage,data);
  }

  ShowInspections(){
    this.IsSelecting=true;
  }

  SelectInspection(inspection){
    this.CurInspection=inspection;
    this.IsSelecting=false;
    this.GetAcceptances();
  }
}
