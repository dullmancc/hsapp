import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EpWitSamplePage} from "../ep-wit-sample";
import {ApiUrl} from "../../../../providers/Constants";
import {HttpService} from "../../../Service/HttpService";
import {EpMateEntryPage} from "../../ep-mate-entry/ep-mate-entry";
import {EpMateEntrySeePage} from "../../ep-mate-entry/ep-mate-entry-see/ep-mate-entry-see";
import {EPWitnSample} from "../../../../Model/EPWitnSample";
import {EPMaterialsCheck} from "../../../../Model/EPMaterialsCheck";
import {EpWitSampleSeePage} from "../ep-wit-sample-see/ep-wit-sample-see";

/**
 * Generated class for the EpWitListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-wit-list',
  templateUrl: 'ep-wit-list.html',
})
export class EpWitListPage {
  //合格
  public Qualified:EPWitnSample[]=[] ;
  //不合格
  public  Unqualified:EPWitnSample[]=[]  ;
  //送审
  public Trial:EPWitnSample[]=[] ;
  //复查
  public Review:EPWitnSample[]=[]  ;
  //抽样
  public  Sampling:EPWitnSample[]=[]  ;
  public ePMaterialsCheck:EPMaterialsCheck;
  public EProjectID;
  public EmployeeID;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpService) {
    this.EmployeeID = this.navParams.get("EmployeeID");
    this.ePMaterialsCheck = this.navParams.get('EPMaterialsCheck');
    this.EProjectID = this.navParams.get('EProjectID');
    this.Load();
  }




  Load() {
    this.http.get(ApiUrl+"EPWitnSamples/GetCheckWit?EPCheckID="+this.ePMaterialsCheck.EPCheckID)
      .subscribe(res => {
        //返回结果，直接是json形式
        this.Qualified = res.Qualified;
        this.Unqualified = res.Unqualified;
        this.Trial = res.Trial;
        this.Review = res.Review;
        this.Sampling = res.Sampling;
        console.log(res);
      }, error => {
        //错误信息
        alert(error);
      });
  }


  ionViewDidEnter() {
    this.Load();
    console.log('Load Again');
  }

  goBack(){
    this.navCtrl.pop();
  }
  addEPWitSamp(){
    this.navCtrl.push(EpWitSamplePage,{'EmployeeID':this.EmployeeID,'EPMaterialsCheck':this.ePMaterialsCheck,'Type':0});
  }

  goEPWit(item){
    if(item.State>=3){
      this.navCtrl.push(EpWitSampleSeePage,{'EmployeeID':this.EmployeeID,'EPMaterialsCheck':this.ePMaterialsCheck,'Type':1,'EPWitSamples':item});
    }else{
      this.navCtrl.push(EpWitSamplePage,{'EmployeeID':this.EmployeeID,'EPMaterialsCheck':this.ePMaterialsCheck,'Type':1,'EPWitSamples':item});
    }
  }
  /**EPEntryResult
   0   --  抽样中
   1   --  送审中
   2   --  复审中
   3   --  合格
   4   --  不合格
   **/
  GetTuPian(itemResult){
    switch (itemResult){
      case 0: return './assets/imgs/workicon/secissues.png';
      case 1: return './assets/imgs/workicon/fushi.png';
      case 2: return './assets/imgs/workicon/fushi.png';
      case 3: return './assets/imgs/workicon/qualified.png';
      case 4: return './assets/imgs/workicon/unqualified.png';
    }
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
}
