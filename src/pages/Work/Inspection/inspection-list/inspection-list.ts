import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NormalPzPage} from "../../../JianLiPZ/normal-pz/normal-pz";
import {InspectionPage} from "../inspection/inspection";
import {HttpService} from "../../../Service/HttpService";
import {ApiUrl} from "../../../../providers/Constants";

/**
 * Generated class for the AccepetanceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inspection-list',
  templateUrl: 'inspection-list.html',
})
export class InspectionListPage {
  EmployeeID;
  EProjectID;
  InspectionTypes;
  unfinished;
  finished;
  hasEntered;
  reportItems;
  CurReportInspection;
  pet='unfinished';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpService) {
    this.hasEntered=false;
    this.EProjectID=this.navParams.get('EProject').EProjectID;
    this.EmployeeID=this.navParams.get('userId')
    this.load();
  }

  load(){
    this.GetECUnitReportInspections();
  }

  newInspection(){
    this.navCtrl.push(InspectionPage,{'EmployeeID':this.EmployeeID,'EProjectID':this.EProjectID,'EPCheckParent':this.CurReportInspection.EPCheckParent,'State':-1});
  }

  goBack(){
    if(!this.hasEntered)  this.navCtrl.pop();
    else this.hasEntered=false;
  }

  GetInspectionType(){
    this.http.get(ApiUrl+"Inspection/GetInspectionType").subscribe(data=>{
      this.InspectionTypes=data;
    });
  }

  GetInspectionRecords(){
    this.http.get(ApiUrl+"Inspection/GetInspectionRecords?EmployeeID="+this.EmployeeID+"&EProjectID="+this.EProjectID).subscribe(data=>{
      this.unfinished=data.unfinished;
      this.finished=data.finished;
    });
  }

  GetInspectionTypeName(id){
    this.InspectionTypes.forEach(it=>{
      if(it.InspectionTypeID.Equals(id)){
        return it.InspectionTypeName;
      }
    });
  }

  GetECUnitReportInspections(){
    this.http.get(ApiUrl+"Inspection/GetECUnitReportInspections?EprojectID="+this.EProjectID).subscribe(data=>{
      this.reportItems=data;
    });
  }

  GoToInspectionRecord(ig,State){
    this.navCtrl.push(InspectionPage,{'EmployeeID':this.EmployeeID,'EProjectID':this.EProjectID,'InspectionGroup':ig,'EPCheckParent':this.CurReportInspection.EPCheckParent,'State':State});
  }

  EnterReportInspection(i){
    this.hasEntered=true;
    this.CurReportInspection=i;
    this.GetInspectionRecords();
  }
}
