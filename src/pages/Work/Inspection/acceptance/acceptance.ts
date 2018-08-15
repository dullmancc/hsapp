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
  AcceptanceRecord:AcceptanceRecord;
  IsQualified:boolean;
  InspectionID;
  State;
  callback;
  isReadOnly;
  Origin:AcceptanceRecord;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpService) {
    this.AcceptanceRecord=this.navParams.get("AcceptanceRecord");
    this.backup(this.AcceptanceRecord);
    console.log("enter")
    console.log(this.AcceptanceRecord);
    this.InspectionID=this.navParams.get("InspectionID");
    this.State=this.navParams.get("State");
    this.callback=this.navParams.get("callback");
    this.IsQualified=true;


    this.InitRecord();
  }

  InitRecord(){
    if(this.State==0){
      this.isReadOnly=false;
    }
    else {
      this.isReadOnly=true;
    }

    if(this.AcceptanceRecord.CheckResult==1){
      this.IsQualified=true;
    }
    else {
      this.IsQualified=false;
    }

  }

  backup(acr:AcceptanceRecord){
    this.Origin=new AcceptanceRecord();
    this.Origin.Acceptance=acr.Acceptance;
    this.Origin.AcceptanceID=acr.AcceptanceID;
    this.Origin.InspectionID=acr.InspectionID;
    this.Origin.MinSampleNum=acr.MinSampleNum;
    this.Origin.RealSampleNum=acr.RealSampleNum;
    this.Origin.CheckRecord=acr.CheckRecord;
    this.Origin.CheckResult=acr.CheckResult;
    this.Origin.IsConfirmed=acr.IsConfirmed;
  }

  goback(){
    this.AcceptanceRecord=this.Origin;
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
