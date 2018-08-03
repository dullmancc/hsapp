import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ListPage} from "../ep-mate-entry/list/list";
import {EpWitSamplePage} from "../ep-wit-sample/ep-wit-sample";
import {EpWitListPage} from "../ep-wit-sample/ep-wit-list/ep-wit-list";
import {HttpService} from "../../Service/HttpService";
import {ApiUrl} from "../../../providers/Constants";
import {EPMaterialsCheck} from "../../../Model/EPMaterialsCheck";

/**
 * Generated class for the EpMateCheckListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-mate-check-list',
  templateUrl: 'ep-mate-check-list.html',
})
export class EpMateCheckListPage {
  public enter:number;
  public EmployeeID;
  public EProjectID;
  public epMaterialsCheck:EPMaterialsCheck[]=[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public http:HttpService) {
    this.enter = 1;
    this.enter = this.navParams.get("type");
    this.EmployeeID = this.navParams.get('EmployeeID');
    this.EProjectID = this.navParams.get('EProjectID');
  }

  ionViewDidLoad() {
    let loader=this.loadingCtrl.create();
    loader.present();

    console.log('ionViewDidLoad EpMateCheckListPage');
    this.http.get(ApiUrl+'EPMaterialsChecks/GetEProjectMateChecks?EProjectID='+this.EProjectID.EProjectID).subscribe(res=>{
      for(var i = 0;i<res.length;i++){
       let objep = new EPMaterialsCheck(res[i].EPCheckID,res[i].EPCheckParent.EPCheckName,res[i].EPCheckParent.EProjectID,res[i].EntryDate,res[i].EPCheckParent.ECUnit.Name,res[i].EPCheckParent.ECUnit.ECUnitID);
       this.epMaterialsCheck.push(objep);
      }
      loader.dismiss();
    },error=>{
      loader.dismiss();
      alert('请求失败');
    });
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


  EnterMate(Epmaterialscheck){
    if(this.enter==1){
      this.navCtrl.push(ListPage,{'EPMaterialsCheck':Epmaterialscheck,'EProjectID':this.EProjectID.EProjectID,'EmployeeID':this.EmployeeID});
    }else{
      this.navCtrl.push(EpWitListPage,{'EPMaterialsCheck':Epmaterialscheck,'EProjectID':this.EProjectID.EProjectID,'EmployeeID':this.EmployeeID});
    }
  }
}
