import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {IonicPage} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {LoginPage} from "../login/login";
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  hasLoggin;
  constructor(public navCtrl: NavController) {

  }

  ionViewWillEnter(){
    if(LoginPage.Login) this.hasLoggin=true;
    else this.hasLoggin=false;
  }
}
