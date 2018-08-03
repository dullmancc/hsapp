import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ObservationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
export class key{
  content:any;
  advice:any;
  dealCase:any;
}
@Component({
  selector: 'page-observation',
  templateUrl: 'observation.html',
})
export class ObservationPage {
  keys:key[]=[{content:"1、施工单位是否按工程设计文件、工程建设标准和批准的施工组织设计、（专项）施工方案施工。",
    advice:"",dealCase:""},
    {content:"2、工程中使用的工程材料、构配件和设备是否合格。",advice:"",dealCase:""},
    {content:"3、施工现场质量管理人员是否到位。",advice:"",dealCase:""},
    {content:"4、施工现场安全管理人员是否到位。",advice:"",dealCase:""},
    {content:"5、特种作业人员是否持证上岗。",advice:"",dealCase:""},
    {content:"6、总、分包单位工序配合是否协调一致。",advice:"",dealCase:""},
    {content:"7、已施工部位是否存在质量缺陷（安全隐患）。",advice:"",dealCase:""},
    {content:"8、整改是否到位，未批准复工的工程是否擅自恢复施工；上道工序未经验收是否已开展下道工序施工。",advice:"",dealCase:""}];
  hideList:boolean[]=[true,true,true,true,true,true,true,true];
  iconName:string[]=["arrow-dropright","arrow-dropright","arrow-dropright","arrow-dropright","arrow-dropright","arrow-dropright","arrow-dropright","arrow-dropright"];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  showDiv(i){
    console.log(i);
    this.hideList[i]=!this.hideList[i];
    if(this.hideList[i])
    this.iconName[i]="arrow-dropright";
    else
      this.iconName[i]="arrow-dropdown";
  }

  goBack(){
    this.navCtrl.pop();
  }
}
