import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as Swiper from 'swiper';
import {ObservationPage} from "../Work/observation/observation";
import {LoginPage} from "../login/login";
import {HomePage} from "../home/home";
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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.IsLogin = LoginPage.Login;
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
