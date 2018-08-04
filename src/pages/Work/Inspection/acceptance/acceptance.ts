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
  Acceptance;
  AcceptanceRecord:AcceptanceRecord;
  IsQualified:boolean;
  InspectionID;
  State;
  callback;
  isRedOnly;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpService) {
    this.Acceptance=this.navParams.get("Acceptance");
    this.InspectionID=this.navParams.get("InspectionID");
    this.State=this.navParams.get("State");
    this.callback=this.navParams.get("callback");
    this.IsQualified=true;


    this.InitRecord();
  }

  InitRecord(){
    console.log(this.InspectionID);
    if(this.InspectionID && this.InspectionID!=""){
      console.log("old rac")
      if(this.State==0){
        this.isRedOnly=false;
      }
      else {
        this.isRedOnly=true;
      }

      this.http.get(ApiUrl+"Inspection/GetAcceptanceRecord?InspectionID="+this.InspectionID+"&AcceptanceID="+this.Acceptance.AcceptanceID).subscribe(data=>{
        if(data!=null){
          this.AcceptanceRecord=data;
        }

      });
    }
    else {
      console.log("new acr");
      this.isRedOnly=false;
      this.AcceptanceRecord=new AcceptanceRecord();
      this.AcceptanceRecord.AcceptanceID = this.Acceptance.AcceptanceID;
      this.AcceptanceRecord.InspectionID = "";
      this.AcceptanceRecord.MinSampleNum = 0;
      this.AcceptanceRecord.RealSampleNum = 0;
      this.AcceptanceRecord.CheckRecord = "";
      this.AcceptanceRecord.CheckResult = 1;

    }
  }

  goback(){
    this.navCtrl.pop();
  }

  confirm(){
    if(this.IsQualified)  this.AcceptanceRecord.CheckResult=1;
    else this.AcceptanceRecord.CheckResult=0;
    this.callback(this.AcceptanceRecord);
    this.navCtrl.pop();
  }
}
