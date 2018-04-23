import {Component, Input} from '@angular/core';
import {TabsPage} from "../../pages/tabs/tabs";
import {LoginPage} from "../../pages/login/login";
import {ListPage, Project} from "../../pages/Work/ep-mate-entry/list/list";
import {ObservationPage} from "../../pages/Work/observation/observation";
import {ErrorPage} from "../../pages/error/error";
import {NavController, NavParams} from "ionic-angular";
import {SecIssuesPage} from "../../pages/Work/sec-issues/sec-issues";
import {ProjectPage} from "../../pages/Project/project";
import {HomePage} from "../../pages/home/home";
import {JLProjectPage} from "../../pages/JianLiPZ/JLProject";
import {EpMateEntryPageModule} from "../../pages/Work/ep-mate-entry/ep-mate-entry.module";
import {EpMateEntryPage} from "../../pages/Work/ep-mate-entry/ep-mate-entry";
import {EpWitSamplePage} from "../../pages/Work/ep-wit-sample/ep-wit-sample";
import {EpMateCheckListPage} from "../../pages/Work/ep-mate-check-list/ep-mate-check-list";

/**
 * Generated class for the MyworkComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mywork',
  templateUrl: 'mywork.html'
})
export class MyworkComponent {

  JianliYuan =[];
  JianliShi = [];
  ZongJian = [];
  text: string;
  postion:number;
  @Input() MyProject:Project;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('Hello MyworkComponent Component');
    this.text = 'Hello World';
    this.JianliShi = this.getJianliShi();
    this.JianliYuan = this.getJianliYuan();
    this.ZongJian = this.getZongJian();
    this.LoadPosition();
  }
  LoadPosition(){
    //如果是管理人员
    if(TabsPage.UserInfo.userroles.Type =='Management'){
      this.postion = 3;
    }else if(TabsPage.UserInfo.userroles.Type =='Project'){
      if(typeof TabsPage.UserInfo.userroles.Role === 'undefined'){
        this.postion = -1;
      }else{
        switch(TabsPage.UserInfo.userroles.Role){
          case 'JSE':
            this.postion = 2;
            break;
          case 'SE':
            this.postion = 1;
            break;
          case 'ChiefSE':
            this.postion = 3;
            break;
          default:
            break;
        }
      }
    }


  }

  getJianliYuan(){
    return [[
      {'name':'我的工程',
      'src':'assets/imgs/workicon/project.png',
      'alt':  ProjectPage,
        'NavParm':{'charNum':this.MyProject}
    },
      //pangzhan.png
      {'name':'旁站监理',
        'src':'assets/imgs/workicon/pangzhan.png',
        'alt': JLProjectPage,
        'NavParm':{'charNum':this.MyProject,'userId':TabsPage.UserInfo.employees.EmployeeID}
      },
      //jlpz.png
      {'name':'监理巡视',
        'src':'assets/imgs/workicon/jlpz.png',
        'alt':ObservationPage,
        'NavParm':{'userId':TabsPage.UserInfo.employees.EmployeeID}
      },
      //workrecord.png
      {'name':'工作记录',
        'src':'assets/imgs/workicon/workrecord.png',
        'alt':ErrorPage,
        'NavParm':{}
      },
    ],
      [
        {
          'name':'安全履职',
          'src':'assets/imgs/workicon/security.png',
          'alt':SecIssuesPage,
          'NavParm':{}
        },
        {
          'name':'材料进场',
          'src':'assets/imgs/workicon/mateentry.png',
          'alt':EpMateCheckListPage,
          'NavParm':{'type':1}
        },
        { 'name':'搜索',
          'src':'assets/imgs/workicon/sousuo.png',
          'alt':ErrorPage,
          'NavParm':{}
       },
      //three.png
        {'name':'模块5',
          'src':'assets/imgs/workicon/three.png',
          'alt':ErrorPage,
          'NavParm':{}
        }
        ],
      [
        {
          'name':'见证取样',
          'src':'assets/imgs/workicon/quyang.png',
          'alt':EpMateCheckListPage,
          'NavParm':{'type':2}
        },
      ]
    ]
  }

  getJianliShi(){
    return [
              [
                {'name':'我的工程',
                  'src':'assets/imgs/workicon/project.png',
                  'alt':  ProjectPage,
                  'NavParm':{'charNum':this.MyProject}
                },
                //pangzhan.png
                {'name':'旁站监理',
                  'src':'assets/imgs/workicon/pangzhan.png',
                  'alt': JLProjectPage,
                  'NavParm':{'charNum':this.MyProject,'userId':TabsPage.UserInfo.employees.EmployeeID}
                },
                //rizhi.png
                {'name':'监理日志',
                  'src':'assets/imgs/workicon/rizhi.png',
                  'alt':ErrorPage,
                  'NavParm':{}
                },
                //原材料进场审核
                {'name':'监理巡视',
                  'src':'assets/imgs/workicon/jlpz.png',
                  'alt':ObservationPage,
                  'NavParm':{'userId':TabsPage.UserInfo.employees.EmployeeID}
                },
              ],
              [
                {
                  'name':'材料进场',
                  'src':'assets/imgs/workicon/mateentry.png',
                  'alt':EpMateCheckListPage,
                  'NavParm':{'type':1}
                },
                //quyang.png
                {
                  'name':'见证取样',
                  'src':'assets/imgs/workicon/quyang.png',
                  'alt':EpMateCheckListPage,
                  'NavParm':{'type':2}
                },
                {'name':'工作记录',
                  'src':'assets/imgs/workicon/workrecord.png',
                  'alt':ErrorPage,
                  'NavParm':{}
                },
                {'name':'搜索',
                  'src':'assets/imgs/workicon/sousuo.png',
                  'alt':ErrorPage,
                  'NavParm':{}
                },
              ],
              [
                {
                  'name':'安全履职',
                  'src':'assets/imgs/workicon/security.png',
                  'alt':SecIssuesPage,
                  'NavParm':{}
                },
                {'name':'模块5',
                  'src':'assets/imgs/workicon/three.png',
                  'alt':ErrorPage,
                  'NavParm':{}
                }
              ]
    ]
  }

  getZongJian(){
    return [
              [
                {'name':'我的工程',
                  'src':'assets/imgs/workicon/project.png',
                  'alt':  ProjectPage,
                  'NavParm':{'charNum':this.MyProject}
                },
                //pangzhan.png
                {'name':'旁站监理',
                  'src':'assets/imgs/workicon/pangzhan.png',
                  'alt': JLProjectPage,
                  'NavParm':{'charNum':this.MyProject,'userId':TabsPage.UserInfo.employees.EmployeeID}
                },
                {'name':'监理日志',
                  'src':'assets/imgs/workicon/rizhi.png',
                  'alt':ErrorPage,
                  'NavParm':{}
                },
                //原材料进场审核
                {'name':'监理巡视',
                  'src':'assets/imgs/workicon/jlpz.png',
                  'alt':ObservationPage,
                  'NavParm':{'userId':TabsPage.UserInfo.employees.EmployeeID}
                },
              ] ,
              [
                {
                  'name':'材料进场',
                  'src':'assets/imgs/workicon/mateentry.png',
                  'alt':EpMateCheckListPage,
                  'NavParm':{'type':1}
                },
                {
                  'name':'见证取样',
                  'src':'assets/imgs/workicon/quyang.png',
                  'alt':EpMateCheckListPage,
                  'NavParm':{'type':2}
                },
                {'name':'工作记录',
                  'src':'assets/imgs/workicon/workrecord.png',
                  'alt':ErrorPage,
                  'NavParm':{}
                },
                {'name':'搜索',
                  'src':'assets/imgs/workicon/sousuo.png',
                  'alt':ErrorPage,
                  'NavParm':{}
                },
              ] ,
              [
                {
                  'name':'安全履职',
                  'src':'assets/imgs/workicon/security.png',
                  'alt':SecIssuesPage,
                  'NavParm':{}
                },
                {'name':'模块5',
                  'src':'assets/imgs/workicon/three.png',
                  'alt':ErrorPage,
                  'NavParm':{}
                }
              ]
    ]
  }

  UpdateInfo(){
    this.JianliShi = this.getJianliShi();
    this.JianliYuan = this.getJianliYuan();
    this.ZongJian = this.getZongJian();
  }

  SetClick(xi,yj,num){
   this.UpdateInfo();
   console.log(xi+" ,"+yj+" ,"+num);
   switch (num){
     case 1:
       this.navCtrl.push(this.JianliYuan[xi][yj].alt,this.JianliYuan[xi][yj].NavParm);
       break;
     case 2:
       this.navCtrl.push(this.JianliShi[xi][yj].alt,this.JianliShi[xi][yj].NavParm);
       break;
     case 3:
       this.navCtrl.push(this.ZongJian[xi][yj].alt,this.ZongJian[xi][yj].NavParm);
       break;
     default:
       break;
   }
  }

}
