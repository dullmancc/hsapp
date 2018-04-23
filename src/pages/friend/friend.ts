import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {ProjectPage} from "../Project/project";
import {HttpService} from "../Service/HttpService";
import {JLProjectPage} from "../JianLiPZ/JLProject";
import {TabsPage} from "../tabs/tabs";
import {Project} from "../../Model/EPProject";
import {ApiUrl} from "../../providers/Constants";

/**
 * Generated class for the FriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html',
})
export class FriendPage {
  public pro:Project[];
  public items;
  public userId: number = -1 ;
  constructor(public navCtrl: NavController,public  navparm:NavParams,private http: HttpService,public modalCtrl: ModalController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.pro = [];
    //this.url = "http://193.112.12.241/HSWebApi/api/";
    //http://localhost:1857/
    if(typeof (TabsPage.UserInfo)!=='undefined'){
      this.userId = TabsPage.UserInfo.employees.EmployeeID;
      this.Load();
    }
  }

  //跳转进入下个页面
  openModal(characterNum) {
      this.navCtrl.push(ProjectPage,{charNum:characterNum})
  }

  /*
  *数字类型代表项目类型
  * 1:民用建筑项目
  * 2:土建工程项目
  * 3:地铁项目
  * 4:公共交通项目
  * */
  Load() {
    this.http.get(ApiUrl+"Project/GetMyEProjects?EmployeeId="+TabsPage.UserInfo.employees.EmployeeID)
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
