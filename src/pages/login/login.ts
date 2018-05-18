import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {HttpService} from "../Service/HttpService";
import {App} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {BackgroundMode} from "@ionic-native/background-mode";
import {Platform} from  "ionic-angular";
import {BackButtonService} from "../Service/backButtonService";
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {User} from "../../Model/User";
import {ApiUrl} from "../../providers/Constants";
import {HomePage} from "../home/home";
import {IndexPage} from "../index";
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
//const url = "http://193.112.12.241/HSWebApi/";
//const url = "http://localhost:1857/";
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public Sno:string;
  public username:string;
  public password:string;
  public myUser:User;
  public length:number;
  public static Login:boolean=false;
  body;
  power;
  mushrooms;
  CanGoBack:boolean;
  constructor(public alertCtrl: AlertController,
              private http: HttpService,
              public app:App,
              public loadingCtrl: LoadingController,
              private bg:BackgroundMode,
              private platform:Platform,
              private backbtService:BackButtonService,
              private httpc:HttpClient,
              public navCtrl: NavController ) {
    this.platform.ready().then(()=>{
      console.log("Login Start OverBack");
      this.backbtService.registerBackButtonAction(null);
    });

    if(this.navCtrl.canGoBack()){
      this.CanGoBack = true;
    }else {
      this.CanGoBack = false;
    }

    this.length = window.localStorage.length;
    this.myUser = new User();
    if(this.length!=0){
      this.username = window.localStorage.getItem("username");
      this.password = window.localStorage.getItem("password");
      this.mushrooms = true;
    }else{
      this.mushrooms = false;
    }

  }

  logIn() {
    let loader = this.loadingCtrl.create({
      content: "登录中..."
    });
    loader.present();
    this.myUser.UserName =  ''+this.username;
    this.myUser.Password =''+ this.password;
    this.myUser.grant_type = 'password';

    this.body = 'grant_type='+this.myUser.grant_type+'&username='+this.myUser.UserName+'&password='+this.myUser.Password ;
    if (this.myUser.UserName.length == 0) {
      this.showAlert("请输入账号");
    } else if (this.myUser.Password.length == 0) {
      this.showAlert("请输入密码");
    } else {
     this.http.post(ApiUrl.substr(0,ApiUrl.length-4)+'Token',this.body ) .subscribe(res => {
          if(res.userName==this.myUser.UserName){
              this.Sno = res.userName;
              if(this.mushrooms){
                window.localStorage.setItem('username',this.myUser.UserName);
                window.localStorage.setItem('password',this.myUser.Password);
              }
            sessionStorage.setItem('accessToken', res.access_token);
            console.log(sessionStorage.getItem('accessToken'));
            //请求用户信息
            this.MyAccounts(this.Sno,loader);
          }else {
            loader.dismiss();
            this.showAlert("账号或密码错误!");
          }
     }, error => {
       loader.dismiss();
       this.showAlert("Get Error");
     });
    }
  }

  //获取用户信息
  MyAccounts(Sno,loader){
    //请求头部要加入token，否则无法访问
    let headers = new HttpHeaders({"Accept" :"*/*","Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",
      "Authorization":"Bearer 28_Hvu3lriGy23eakmA-GgIqewb-ayhicxD1bACyXeiDoiZt05y8qQjvOD3jDvQTjYAo5oeIx0djj-fYUSUJGCCfCJ2RFXMY_FsjBjKf3Uyobm0e_-u2BIxTKqk5VQvuAeAGbDIoL5iP-qk4BXtVNl_C_fyllnft9z5DDn__cB3HTTgd8ydSX7e-nlzvXUW8RPLnadz5wQ6rfs6kCp81De7wRfzoJ5eZCOfZKYBZeyWwi9YaUOs3qDMfIA4xPylA51la7kwDf7Z2g-KDxUg5pNb9gRC0VCEPP3SHK6pd_ojatuHCmb9_I14wCv3Onowp8sqE709I8TDpfxcAQmpHy8Su1A2awrdwUXmXYoviWYkxmRlmWiCYQcOrxMsomZs2VNHmpwy3LvD2fn0T_eXcnku6B3VLkQIfHCzSR07E6rOUIiKD_bZNjpSzTQhm9N78A3eeymKPLe9sZu23NaaOEnL_NkJLLCozJaoCBsCx47oyQKKvlGJglaO9ECZ3D82T"});
      //this.httpc.get(url+'api/UserInfo/GetInfo?UserName='+Sno,{headers}).subscribe( res=>{
    this.http.get(ApiUrl+'UserInfo/GetInfo?UserName='+Sno,).subscribe( res=>{
      this.power = res;
      loader.dismiss();
      LoginPage.Login = true;
      this.app.getRootNav().setRoot(TabsPage,{UserInfo:this.power});
      //this.navCtrl.setRoot(TabsPage,{UserInfo:this.power})

     // this.navCtrl.push(HomePage);
    }, error => {
      loader.dismiss();
      this.showAlert("请求UserInfo错误");
    });
  }
  goBack(){
    this.navCtrl.pop();
  }

  showAlert(words) {
    let alert = this.alertCtrl.create({
      title: '登陆失败',
      subTitle: words,
      buttons: ['OK']
    });
    alert.present();
  }
}
