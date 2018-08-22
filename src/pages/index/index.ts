
import {Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import * as Swiper from 'swiper';
import {ObservationPage} from "../Work/observation/observation";
import {LoginPage} from "../login/login";
import {HomePage} from "../home/home";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import * as $ from 'jquery';
import {TabsPage} from "../tabs/tabs";
import {JLProjectPage} from "../JianLiPZ/JLProject";
import {InspectionListPage} from "../Work/Inspection/inspection-list/inspection-list";
import {StackPanelComponent} from "../../components/stack-panel/stack-panel";
import {Project} from "../Work/ep-mate-entry/list/list";
import {HttpService} from "../Service/HttpService";
import {ApiUrl} from "../../providers/Constants";
/**
 * Generated class for the IndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-index',
  templateUrl: 'indexpage.html',
})
export class IndexPage {
  IsLogin:boolean;
  now :number=0;
  loader;
  timer1;
  //xyw
  messages:Array<{MessageType:string,EProject:string,Time:any,EmployeeName:string,SRC:any,State:any,DESC:string}>;
  SelectingProj:boolean;

  EProjects:Project[];
  CurProject:Project;
  @ViewChild("stack")
  stackpanel:StackPanelComponent;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private androidPermissions: AndroidPermissions,
              private platform:Platform,
              public toastCtrl: ToastController,
              private http: HttpService) {
    this.IsLogin = LoginPage.Login;
    this.SelectingProj=false;
    //权限询问
    var list = [
      androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
      androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      androidPermissions.PERMISSION.READ_PHONE_STATE,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      androidPermissions.PERMISSION.WAKE_LOCK,
      this.androidPermissions.PERMISSION.INTERNET,
    ];

    //仅针对android平台
    if(this.platform.is('android')){
      //是否有定位权限
      this.androidPermissions.checkPermission(list[0]).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      );
      this.androidPermissions.requestPermissions(list);
    }

    //xyw
    //项目初始化
    this.CurProject={EProjectID:'',Name:'',EPState:-1,EPTypeId:-1,EPType:''};
    this.GetEProject();

    //动态初始化
    if(true){
      this.messages=[{MessageType:"材料进场",EProject:"协和医院综合住院楼项目",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-checkmark-circle",DESC:"------------通过------------------------------"},
                                {MessageType:"材料进场",EProject:"协和医院综合住院楼项目",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-warning",DESC:"------------不达标但通过-----------"},
                                {MessageType:"材料进场",EProject:"协和医院综合住院楼项目",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-remove-circle",DESC:"------------未通过-----------"},
                                {MessageType:"材料进场",EProject:"协和医院综合住院楼项目",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-remove-circle",DESC:"------------未通过-----------"},
                                {MessageType:"材料进场",EProject:"协和医院综合住院楼项目",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-checkmark-circle",DESC:"------------通过------------------------------"},
                                {MessageType:"材料进场",EProject:"协和医院综合住院楼项目",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-warning",DESC:"------------不达标但通过-----------"},
                                {MessageType:"材料进场",EProject:"协和医院综合住院楼项目",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-remove-circle",DESC:"------------未通过-----------"},
                                {MessageType:"材料进场",EProject:"协和医院综合住院楼项目",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-remove-circle",DESC:"------------未通过-----------"},
                                {MessageType:"材料进场",EProject:"协和医院综合住院楼项目",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-checkmark-circle",DESC:"------------通过------------------------------"},
                                {MessageType:"材料进场",EProject:"湖北公安厅",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-warning",DESC:"------------不达标但通过-----------"},
                                {MessageType:"材料进场",EProject:"武汉美术馆",Time:"8/1/10:25",EmployeeName:"严俊",SRC:"assets/imgs/shuini.jpg",State:"md-remove-circle",DESC:"------------未通过-----------"}];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }
  ionViewDidEnter(){
  }

  ngOnInit(){

  }

  denglu(){
    this.navCtrl.push(LoginPage);
  }

  fileChanged(event){
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 512000) {
        console.log(event.target.files[0]);
        console.log('the file size more than 500kb');
      } else {
        console.log(event.target.files[0]);
        console.log('the file size less than 500kb');
      }
    }
  }

  //xyw
  goSelectProj(){
    this.SelectingProj=true;
  }

  selectProj(item){
    this.CurProject=item;
    this.SelectingProj=false;
  }

  cancle(){
    this.SelectingProj=false;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  GetEProject(){
    console.log(TabsPage.UserInfo.employees.EmployeeID);
    this.http.get(ApiUrl+"Project/GetMyEProjects?EmployeeId="+TabsPage.UserInfo.employees.EmployeeID).subscribe(res=>{
      this.EProjects=res;
      this.CurProject=this.EProjects[0];
    },error=>{
      this.presentToast("请求出错，请稍后再试");
    })
  }
}
