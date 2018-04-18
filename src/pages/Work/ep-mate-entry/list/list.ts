import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController} from 'ionic-angular';
import {HttpService} from "../../../Service/HttpService";
import {ProjectPage} from "../../../Project/project";
import {JLProjectPage} from "../../../JianLiPZ/JLProject";
import {IonicPage} from "ionic-angular";
import {EpMateEntryPage} from "../ep-mate-entry";
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
  public pro:Project[];
  public items;
  public url:string;
  public userId: number = -1 ;
  public type:number;
  public titlename:string = "我的工程项目";
  constructor(public navCtrl: NavController,public  navparm:NavParams,private http: HttpService,public modalCtrl: ModalController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.userId = this.navparm.get("userId");
    this.url = "http://193.112.12.241/HSWebApi/api/";
    this.Load();
    this.type =this.navparm.get("type");
    if (this.type==1){
      this.titlename = "我的工程项目";
    }else if(this.type==2){
      this.titlename = "选择工程项目";
    }
  }

  //跳转进入下个页面
  openModal(characterNum) {
    if(this.type==1){
      this.navCtrl.push(ProjectPage,{charNum:characterNum})
    }else if(this.type==2){
      this.navCtrl.push(JLProjectPage,{charNum:characterNum,userId:this.userId})
    }
  }
  goBack(){
    this.navCtrl.pop();
  }

  addEPMateEntry(){
    this.navCtrl.push(EpMateEntryPage);
  }


  /*
  *数字类型代表项目类型
  * 1:民用建筑项目
  * 2:土建工程项目
  * 3:地铁项目
  * 4:公共交通项目
  * */
  Load() {
    this.http.get(this.url+"Project/GetMyEProjects?EmployeeId="+this.userId)
      .subscribe(res => {
        //返回结果，直接是json形式
        this.items = res;
        console.log(this.items);
        this.pro =[];

        for(var i = 0; i < this.items.length; i++){
          var proj = new Project();
          proj.EProjectID =this.items[i].EProjectID;
          proj.Name = this.items[i].Name;
          proj.EPState =this.items[i].EPState;
          proj.EPTypeId =this.items[i].EPTypeID;
          if(this.items[i].EPTypeID==1){
            proj.EPType = '民用建筑项目';
          }else if(this.items[i].EPTypeID==2){
            proj.EPType = '土建工程项目';
          }else if(this.items[i].EPTypeID==3){
            proj.EPType = '地铁项目';
          }else if(this.items[i].EPTypeID==4){
            proj.EPType = '公共交通项目';
          }
          this.pro.push(proj);
        }
        console.log(this.pro);
      }, error => {
        //错误信息
        alert(error);
      });
  }
}

export class Project {
   public EProjectID:number;    //项目id
   public Name:string;          //项目名称
   public EPState:number;       //项目状态
   public EPTypeId:number;      //项目类型id
   public EPType:string;        //项目类型名称
   constructor(){
     this.EProjectID=0;
     this.Name = '';
     this.EPState=0;
     this.EPTypeId =0 ;
     this.EPType ='';
   }
}
