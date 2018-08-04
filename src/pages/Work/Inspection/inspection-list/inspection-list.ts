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
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpService) {
  }

  public load(){

  }

  public newInspection(){
    this.navCtrl.push(InspectionPage,{'EmployeeID':this.EmployeeID,'EProjectID':this.EProjectID,'State':-1});
  }

  goBack(){
    this.navCtrl.pop();
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

  GoToInspectionRecord(i,State){
    this.navCtrl.push(InspectionPage,{'EmployeeID':this.EmployeeID,'EProjectID':this.EProjectID,'InspectionRecord':i,'State':State});
  }
}
