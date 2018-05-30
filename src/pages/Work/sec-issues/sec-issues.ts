import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
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
  finished:any[]=[]
  unfinished:any[]=[];
  EProject;
  EMPloyeeID;
  public pet = 'all';

  constructor(public pltaform:Platform,public navCtrl: NavController, public navParams: NavParams,public http:HttpService) {
  }

  ionViewWillEnter() {
    this.EProject = this.navParams.get('EProject');
    this.EMPloyeeID = TabsPage.UserInfo.employees.EmployeeID;

    let navP = {'EmployeeId':this.EMPloyeeID,'EProjectId':this.EProject.EProjectID};

    var data = Utils.ParamsToString(navP);
    this.http.get(ApiUrl+"EPSecIssues/GetEPSecIssueForEM?"+data).subscribe(res=>{
      this.unfinished = res.unfinished;
      this.finished = res.finished;
    },error=>{
      alert("请求安全隐患列表出错！");
    });
    //console.log(this.listSecIssus);
  }

  goBack(){
    this.navCtrl.pop();
  }

  GetTime(itemtime){
    let dateitem;
    dateitem = itemtime.substring(0,itemtime.indexOf('-'))+'年'+itemtime.substring(itemtime.indexOf('-')+1,itemtime.indexOf('T'))+itemtime.substring(itemtime.indexOf('T')+1);
    let year =itemtime.slice(0,4);
    let nowyear = new Date().getFullYear().toString();
    let month = dateitem.slice(5,7);
    let nowmonth = (new Date().getMonth()+1).toString();
    if(nowmonth.length==1){
      nowmonth = '0'+nowmonth;
    }
    let day  = dateitem.slice(8,10);
    let nowday = new  Date().getDate();
    // 08:00
    let hourmintes = dateitem.substr(dateitem.length-8,5);
    //04-27 08:00
    let monthhour =  dateitem.substr(5,dateitem.length-8).slice(0,5)+' '+hourmintes;
    //2018年04-27
    let YearMonth = dateitem.substr(0,10);
    if(year==nowyear){
      if(month==nowmonth&&day == nowday){
        return hourmintes;
      }else {
        return monthhour;
      }
    }else {
      return YearMonth;
    }
  }


  GoToExitRecord(EPSecIssue,num){
    if(num==0){
      this.navCtrl.push(SecIssRecordPage,{'EProject':this.EProject.EProjectID,'EMPloyeeID':this.EMPloyeeID,'Type':1,'EPSecIssue':EPSecIssue});
    }else if(num==1){
      this.navCtrl.push(SecIssueslistPage,{'EProject':this.EProject.EProjectID,'EMPloyeeID':this.EMPloyeeID,'Type':1,'EPSecIssue':EPSecIssue});
    }

}


  getState(num){
    switch (num){
      case 1:return "已完成";
      case 0:return "整改中";
    }
  }

  addSecurityIssues(){
    this.navCtrl.push(SecIssRecordPage,{'EProject':this.EProject.EProjectID,'EMPloyeeID':this.EMPloyeeID,'Type':0});
  }


}
