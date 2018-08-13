import {Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import { Project} from "../Work/ep-mate-entry/list/list";
import {TabsPage} from "../tabs/tabs";
import {ObservationPage} from "../Work/observation/observation";
import {HttpService} from "../Service/HttpService";
import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var AMap;

import {IonicPage} from "ionic-angular";
import {ProjectPage} from "../Project/project";
import {JLProjectPage} from "../JianLiPZ/JLProject";
import {ApiUrl} from "../../providers/Constants";
import {MyworkComponent} from "../../components/mywork/mywork";
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public pro:Project[];
  public  currentProject:Project;
  public position:number;

  public items;
  public nowtime;                //现在时间
  public nowweather:WeatherCode; //天气接口
  public _weather;               //天气
  public _tempture;              //温度
  public localplace;             //地名
  public placecode;              //地区代码
  private ISready=false;        //定位是否加载成功
  private imageURI;              //天气图片url
  private IsShow2;               //监理工程师页面
  private IsShow;                //监理员页面
  private IsShow3;               //总监及以上页面
  private _city;                 //城市
  @ViewChild('work1')
  public mywork:MyworkComponent;

  constructor(public navCtrl: NavController,
              public navParams:NavParams,
              private http:HttpService,
              private cd:ChangeDetectorRef,
              public alertCtrl:AlertController,
              public loadingCtrl: LoadingController,
              private androidPermissions: AndroidPermissions,
              private platform:Platform) {

    this.currentProject = new Project();
    this.Load();
    //默认天气
    this.imageURI='./assets/weather/999.png';
    this.nowweather =  new WeatherCode();
    //加载天气
    this.LoadLocation();
    //日期加载
    const formatDate = ( time: any ) => {
      // 格式化日期，获取今天的日期
      const Dates = new Date( time );
      const year: number = Dates.getFullYear();
      const month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
      const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
      return year + '-' + month + '-' + day;
    };

    this.nowtime =  formatDate( new Date().getTime() ); // 当前时间

  }

  ionViewDidLoad() {
  }

  //跳转至监理巡视页面
  TomyOb(){
    this.navCtrl.push(ObservationPage);
  }
  //提示待更新开放
  ToAlert(){
    alert("该功能未开放！");
  }

  goBack(){
    this.navCtrl.pop();
  }

  LoadRole(){
    this.http.get(ApiUrl+"UserInfo/GetRole?UserID="+TabsPage.UserInfo.employees.EmployeeID+"&EProjectID="+this.currentProject.EProjectID).subscribe(res=>{
      TabsPage.UserInfo.userroles.Role=res;
      this.mywork.LoadPosition();
      console.log(this.mywork.position);
      //loader.dismiss();
    }, error => {
      //错误信息
      alert("无法获取角色信息");

    });
  }

  Load() {
    let loader=this.loadingCtrl.create({
      content: ""
    });
    loader.present();

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
        this.currentProject = this.pro[0];

        this.LoadRole();
        loader.dismiss();
      }, error => {
        //错误信息
        loader.dismiss();
        alert(error);
      });

  }


  //加载定位和天气
  LoadLocation(){
    var __this = this;
    //高德地图插件
    AMap.plugin('AMap.Geolocation', function () {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 100000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      geolocation.getCurrentPosition(function(status,result){
        //do something
      });

      AMap.event.addListener(geolocation, 'complete',onComplete);//返回定位信息
      //定位成功回调函数
      function  onComplete(data){
        //console.log(data);
        //获得城市字段
        __this._city = data.addressComponent.city;
        //添加marker
        //地区字段
        __this.localplace = data.addressComponent.city + data.addressComponent.district;
        //地区代码字段
        __this.placecode = data.addressComponent.adcode;
        /*访问高德地图的天气接口
           由于高德地图不提供图片及其他信息
           这里用了混合使用知心天气的天气接口
           每日获得接口信息次数是有限的
         */
        __this.http.get('http://restapi.amap.com/v3/weather/weatherInfo?city=' + data.addressComponent.adcode + '&key=e2a6c86ae212691ab38671b4ab2eb07b').subscribe(data => {
          //获得天气信息
          __this.nowweather = data;
          //显示天气信息
          __this.ISready = true;
          __this._tempture = data.lives[0].temperature;
          //由于跨域等问题，我们先用web api上获取了信息在，通过访问web api 获得天气信息
         // __this.http.get('http://193.112.12.241/HSWebApi/api/Pangzhan/GetWeather?city='+encodeURI(__this._city.substring(0,__this._city.length-1))).subscribe(data=>{
          __this.http.get(ApiUrl+'pangzhan/getweather?city='+encodeURI(__this._city.substring(0,__this._city.length-1))).subscribe(data=>{
            //更新天气信息
            __this.imageURI ='./assets/weather/'+data.HeWeather6[0].now.cond_code+'.png';
            __this._weather  = data.HeWeather6[0].now.cond_txt;
            //强制刷新检查子节点
            __this.cd.detectChanges();

          },error=>{
            __this.imageURI ='./assets/weather/'+999+'.png';
          });
          __this.cd.detectChanges();
        }, error => {
          alert(error);
        });
      }
      AMap.event.addListener(geolocation, 'error', onError);
      //定位失败回调函数
      function onError(data) {
        //alert(JSON.stringify(data));
        //document.getElementById('tip').innerHTML = '定位失败';
        let al = __this.alertCtrl.create({
          title: '定位失败!',
          subTitle: '获取定位权限失败，请手动添加权限!',
          buttons: ['OK']
        });
        al.present();
      }
    });
  }

  compareFn(e1: Project, e2: Project): boolean {
    return e1 && e2 ? e1.EProjectID === e2.EProjectID : e1 === e2;
  }

  Test(){
    this.http.get(ApiUrl+"File/Test").subscribe(msg=>{
      console.log(msg);
    });
  }
}

class WeatherCode{
  status;
  count;
  info;
  infocode;
  lives:Weather[];
}
class Weather{
  province;
  city;
  adcode;
  weather;
  temperature;
  winddirection;
  windpower;
  humidity;
  reporttime;
}
