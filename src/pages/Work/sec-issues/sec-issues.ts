import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ContactPage} from "../../contact/contact";
import {FriendPage} from "../../friend/friend";
import {AboutPage} from "../../about/about";
import {ErrorPage} from "../../error/error";
import {SecIssueslistPage} from "./sec-issueslist/sec-issueslist";
import {SecIssRecordPage} from "./sec-iss-record/sec-iss-record";
import {HttpService} from "../../Service/HttpService";
import {ApiUrl} from "../../../providers/Constants";
import {TabsPage} from "../../tabs/tabs";
import {Utils} from "../../../providers/Utils";

/**
 * Generated class for the SecIssuesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sec-issues',
  templateUrl: 'sec-issues.html',
})
export class SecIssuesPage {
  tab1Root:any = SecIssueslistPage;
  tab2Root:any = SecIssueslistPage;
  tab3Root:any = ErrorPage;
  listSecIssus:any[];
  EProject;
  EMPloyeeID;

  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpService){
  }

  ionViewDidLoad() {
    this.EProject = this.navParams.get('EProject');
    this.EMPloyeeID = TabsPage.UserInfo.EmployeeID;

    let navP = {'EmployeeId':this.EMPloyeeID,'EProjectId':this.EProject.EProjectID};

    var data = Utils.ParamsToString(navP);
    this.http.get(ApiUrl+"EPSecIssues/GetEPSecIssueForEM?"+data).subscribe(res=>{
      this.listSecIssus = res;
    },error=>{
      alert("请求安全隐患列表出错！");
    });
  }

  goBack(){
    this.navCtrl.pop();
  }
  newPZBL(){

  }

  getState(num){
    switch (num){
      case 1:return "已完成";
      case 0:return "整改中";
    }
  }

  addSecurityIssues(){
    this.navCtrl.push(SecIssRecordPage,{'EProject':this.EProject,'EMPloyeeID':this.EMPloyeeID});
  }
}
