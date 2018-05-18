import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import * as Swiper from 'swiper';
import {ObservationPage} from "../Work/observation/observation";
import {LoginPage} from "../login/login";
import {HomePage} from "../home/home";
import {AndroidPermissions} from "@ionic-native/android-permissions";
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
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private androidPermissions: AndroidPermissions,
              private platform:Platform) {
    this.IsLogin = LoginPage.Login;
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }
  ngOnInit(){

  }
  toMyWork(){
    if(LoginPage.Login){
      this.navCtrl.push(HomePage);
    }else{
      this.navCtrl.push(LoginPage);
    }
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
}
