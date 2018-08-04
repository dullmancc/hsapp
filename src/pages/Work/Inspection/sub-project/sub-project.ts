import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../../Service/HttpService";
import {ApiUrl} from "../../../../providers/Constants";

/**
 * Generated class for the SubProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class ProjMisc{
  public DivProjID;
  public SubDivProjID;
  public SubProj;
}

@IonicPage()
@Component({
  selector: 'page-sub-project',
  templateUrl: 'sub-project.html',
})
export class SubProjectPage {
  DivProjs;
  SubDivProjs;
  SubProjs;
  CurDiv;
  CurSubDiv;
  temp;
  State;
  callback;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpService) {
    this.State=this.navParams.get("State");
    this.callback = this.navParams.get('callback');
    this.temp=this.navParams.get("DivProjID");
    this.Load();
  }

  Load(){
    this.GetDivProj();
  }

  goBack(){
    this.navCtrl.pop();
  }

  GetDivProj(){
    this.http.get(ApiUrl+"Inspection/GetDivProj").subscribe(data=>{
      this.DivProjs=data;
      if(this.temp>0){
        this.CurDiv=this.temp;
        this.temp=this.navParams.get("SubDivProjID");
        this.GetSubDivProj(this.CurDiv);
      }
    });
  }

  GetSubDivProj(DivProjID){
    this.http.get(ApiUrl+"Inspection/GetSubDivProj?DivProjID="+DivProjID).subscribe(data=>{
      this.SubDivProjs=data;
      if(this.temp>0){
        this.CurSubDiv=this.temp;
        this.temp=-1;
        this.GetSubProj(this.CurSubDiv);
      }
    });
  }

  GetSubProj(SubDivProjID){
    this.http.get(ApiUrl+"Inspection/GetSubProj?SubDivProjID="+SubDivProjID).subscribe(data=>{
      this.SubProjs=data;
    });
  }

  SetSubProj(SubProj){
    let projMisc=new ProjMisc();
    projMisc.DivProjID=this.CurDiv;
    projMisc.SubDivProjID=this.CurSubDiv;
    projMisc.SubProj=SubProj;
    this.callback(projMisc);
    this.navCtrl.pop();
  }
}
