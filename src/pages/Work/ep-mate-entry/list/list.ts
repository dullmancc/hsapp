import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import { ModalController} from 'ionic-angular';
import {HttpService} from "../../../Service/HttpService";
import {ProjectPage} from "../../../Project/project";
import {JLProjectPage} from "../../../JianLiPZ/JLProject";
import {IonicPage} from "ionic-angular";
import {EpMateEntryPage} from "../ep-mate-entry";
import {ApiUrl} from "../../../../providers/Constants";
import {EPEntryResult, EPMateEntryType, EPMaterials} from "../../../../Model/EPMaterials";
import {EpMateEntrySeePage} from "../ep-mate-entry-see/ep-mate-entry-see";
import {Newpz1Page} from "../../../JianLiPZ/newpz1/newpz1";
import {NormalPzPage} from "../../../JianLiPZ/normal-pz/normal-pz";
@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
/*
listPage 项目列表页面用于   1.我的项目 2.旁站监理
          数字参数即上述 1:我的项目
                         2:旁站监理
* */
export class ListPage {
  public EProjectID;
  public items;
  public EmployeeID;
  public ePMaterialsCheck;
  public fushi:EPMaterials[]=[];
  public unfinished:EPMaterials[]=[];
  public jinchang:EPMaterials[]=[];
  public tuichang:EPMaterials[]=[];
  public pet = 'unfinished';

  public ePMateEntryType:EPMateEntryType;
  public titlename:string = "我的工程项目";
  constructor(public alertCtrl:AlertController,public navCtrl: NavController,public  navparm:NavParams,private http: HttpService,public modalCtrl: ModalController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.EmployeeID = this.navparm.get("EmployeeID");
    this.ePMaterialsCheck = this.navparm.get('EPMaterialsCheck');
    this.EProjectID = this.navparm.get('EProjectID');

    //this.Load();
  }
  goBack(){
    this.navCtrl.pop();
  }

  addEPMateEntry(){
    let alert=this.alertCtrl.create({
      title:"请选择材料进场类型！",
      cssClass:'projectList'
    });

    alert.addInput({
        type: 'radio',
        label: '材料进场',
        value: '0',
        checked: false
    });

    alert.addInput({
      type: 'radio',
      label: '设备进场',
      value: '1',
      checked: false
    });
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.navCtrl.push(EpMateEntryPage,{'EmployeeID':this.EmployeeID,'EPMaterialsCheck':this.ePMaterialsCheck,'Type':0,'EnterType':data,'EProjectID':this.EProjectID});
      }
    });
    alert.present();
  }

  //Type 用户页面复用，保存和未保存都在ep-mate-entry.html中显示
  goEPMate(item,i){
    if(item.State==1){
      this.navCtrl.push(EpMateEntrySeePage,{'EmployeeID':this.EmployeeID,'EPMaterialsCheck':this.ePMaterialsCheck,'Type':1,'EPMaterials':item,'EntryResult':i});
    }else{
      this.navCtrl.push(EpMateEntryPage,{'EmployeeID':this.EmployeeID,'EPMaterialsCheck':this.ePMaterialsCheck,'Type':1,'EPMaterials':item,'EProjectID':this.EProjectID});
    }
  }

  ionViewWillEnter() {
    this.Load();
    console.log("list again DIdLoad");
  }

  /*
  *数字类型代表项目类型
  * 1:民用建筑项目
  * 2:土建工程项目
  * 3:地铁项目
  * 4:公共交通项目
  * */
  Load() {
    this.http.get(ApiUrl+'EPMateEntries/GetMateType').subscribe(res=>{
      this.ePMateEntryType = res.ePMateEntryTypes;
      console.log(res);
    },error=>{
      alert(error);
    });
    this.http.get(ApiUrl+"EPMateEntries/GetCheckMates?EPCheckID="+this.ePMaterialsCheck.EPCheckID)
      .subscribe(res => {
        //返回结果，直接是json形式
        this.fushi = res.fushi;
        this.tuichang = res.tuichang;
        this.jinchang = res.jinchang;
        this.unfinished = res.unfinished;
        console.log(res);
      }, error => {
        //错误信息
        alert(error);
      });
  }

  /**EPEntryResult
    EPMR01   --  进场
    EPMR02   --  退场
    EPMR03   --  进场后检测
   **/
  GetTuPian(itemResult){
    let path;
    for(let i = 0;i<itemResult.EPMateInfoForEntries.length;i++){
      if(itemResult.EPMateInfoForEntries[i].EPEntryResultID == "EPMR03"){
        path = './assets/imgs/workicon/fushi.png';
      }else if(itemResult.EPMateInfoForEntries[i].EPEntryResultID == "EPMR02"){
        path = './assets/imgs/workicon/tuichang.png';
      }else if(itemResult.EPMateInfoForEntries[i].EPEntryResultID == "EPMR01"){
        path = './assets/imgs/workicon/jinchang.png';
      }
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

export class Project {
   public EProjectID:string;    //项目id
   public Name:string;          //项目名称
   public EPState:number;       //项目状态
   public EPTypeId:number;      //项目类型id
   public EPType:string;        //项目类型名称
   constructor(){
     this.EProjectID='';
     this.Name = '';
     this.EPState=0;
     this.EPTypeId =0 ;
     this.EPType ='';
   }
}
