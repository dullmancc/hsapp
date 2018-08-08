import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AcceptanceRecord} from "../../../../Model/Inspection";
import {HttpService} from "../../../Service/HttpService";
import {ApiUrl} from "../../../../providers/Constants";

/**
 * Generated class for the AcceptancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-acceptance',
  templateUrl: 'acceptance.html',
})
export class AcceptancePage {
  AcceptanceGroup;
  AcceptanceRecord:AcceptanceRecord;
  IsQualified:boolean;
  Inspection;
  InspectionID;
  State;
  callback;
  isReadOnly;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpService) {
    this.AcceptanceGroup=this.navParams.get("AcceptanceGroup");
    console.log(this.AcceptanceGroup);
    this.Inspection=this.navParams.get("Inspection");
    this.InspectionID=this.Inspection.InspectionID;
    this.State=this.navParams.get("State");
    this.callback=this.navParams.get("callback");
    this.IsQualified=true;


    this.InitRecord();
  }

  InitRecord(){
    console.log(this.InspectionID);
    if(this.AcceptanceGroup.AcceptanceRecord){
      //已有验收记录
      console.log("old rac")
      if(this.State==0){
        this.isReadOnly=false;
      }
      else {
        this.isReadOnly=true;
      }

      this.AcceptanceRecord=this.AcceptanceGroup.AcceptanceRecord;
      if(this.AcceptanceRecord.CheckResult==1){
        this.IsQualified=true;
      }
      else {
        this.IsQualified=false;
      }
    }
    else {
      //新建验收记录
      console.log("new acr");
      this.isReadOnly=false;
      this.AcceptanceRecord=new AcceptanceRecord();
      this.AcceptanceRecord.AcceptanceID = this.AcceptanceGroup.Acceptance.AcceptanceID;
      this.AcceptanceRecord.InspectionID = "";
      if(this.InspectionID!="") this.AcceptanceRecord.InspectionID =this.InspectionID;
      this.AcceptanceRecord.MinSampleNum = 0;
      this.AcceptanceRecord.RealSampleNum = 0;
      this.AcceptanceRecord.CheckRecord = "";
      this.AcceptanceRecord.IsConfirmed = false;
      this.AcceptanceRecord.CheckResult = 1;
    }
  }

  goback(){
    this.navCtrl.pop();
  }

  save(){
    if(this.IsQualified)  this.AcceptanceRecord.CheckResult=1;
    else this.AcceptanceRecord.CheckResult=0;

    this.AcceptanceRecord.IsConfirmed = false;
    this.callback(this.AcceptanceRecord);
    this.navCtrl.pop();
  }

  confirm(){
    if(this.IsQualified)  this.AcceptanceRecord.CheckResult=1;
    else this.AcceptanceRecord.CheckResult=0;

    this.AcceptanceRecord.IsConfirmed = true;
    this.callback(this.AcceptanceRecord);
    this.navCtrl.pop();
  }
}
