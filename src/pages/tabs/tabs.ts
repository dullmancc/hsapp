import { Component } from '@angular/core';
import {ViewChild,} from "@angular/core";
import {Platform} from  "ionic-angular";
import {Tabs} from "ionic-angular";
import {BackButtonService} from "../Service/backButtonService";
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import {NavParams} from "ionic-angular";
import {IonicPage} from "ionic-angular";
import {IndexPage} from "../index";
import {FriendPage} from "../friend/friend";
import {LoginPage} from "../login/login";
@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  @ViewChild('myTabs') tabRef:Tabs;
  tab1Root = IndexPage;
  tab2Root = HomePage;
  tab3Root = AboutPage;
  tab4Root:any;
  public static UserInfo;
  constructor(public navParams:NavParams,private platform:Platform,private backBt:BackButtonService) {
   this.platform.ready().then(()=>{
     this.backBt.registerBackButtonAction(this.tabRef);
     console.log("Tabs Start OverBack")
   });
    TabsPage.UserInfo =this.navParams.get("UserInfo");
    if(LoginPage.Login==true){
      this.tab4Root = ContactPage;
    }else {
      this.tab4Root = LoginPage;
    }
    console.log("UserInfo"+TabsPage.UserInfo);
  }
}
