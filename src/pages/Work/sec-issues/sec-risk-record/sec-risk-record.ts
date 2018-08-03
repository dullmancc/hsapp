import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SecRiskRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
export class secItem{
  content:any;
  issues:any;
  dealCase:any;
}
@Component({
  selector: 'page-sec-issues-record',
  templateUrl: 'sec-risk-record.html',
})
export class SecRiskRecordPage {
  public secItems=[
    {content:"1、施工单位专职安全生产管理人员到岗。",qualified:false,dealCase:""},
    {content:"2、特种作业人员持证到岗。",qualified:false,dealCase:""},
    {content:"3、起重施工机械、建筑材料及设备定期维修保养。",qualified:false,dealCase:""},
    {content:"4、专项施工方案交底。",qualified:false,dealCase:""},
    {content:"5、安全技术交底。",qualified:false,dealCase:""},
    {content:"6、危大工程名称、施工时间和具体责任人员公告。",qualified:false,dealCase:""},
    {content:"7、危险区域安全警示标志设置。",qualified:false,dealCase:""},
    {content:"8、专项施工方案执行。",qualified:false,dealCase:""}];
  public xunchaShow=false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.secItems);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SecRiskRecordPage');
  }

  xuncha(){
    this.xunchaShow=!this.xunchaShow;
  }

  goBack(){
    this.navCtrl.pop();
  }
}
