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
  CurSub;

  callback;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpService) {
    this.callback = this.navParams.get('callback');
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
    });
  }

  GetSubDivProj(DivProjID){
    this.http.get(ApiUrl+"Inspection/GetSubDivProj?DivProjID="+DivProjID).subscribe(data=>{
      this.SubDivProjs=data;
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
