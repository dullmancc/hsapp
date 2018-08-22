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
import {DiscoverPage} from "../discover/discover";
import {InformationPage} from "../information/information";
@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  @ViewChild('myTabs') tabRef:Tabs;
  tab1Root = AboutPage;
  tab2Root = DiscoverPage;
  tab3Root = IndexPage;
  tab4Root = InformationPage;
  tab5Root = ContactPage;
  public static UserInfo;
  constructor(public navParams:NavParams,private platform:Platform,private backBt:BackButtonService) {
   this.platform.ready().then(()=>{
     this.backBt.registerBackButtonAction(this.tabRef);
     console.log("Tabs Start OverBack")
   });
    TabsPage.UserInfo =this.navParams.get("UserInfo");
    console.log("UserInfo"+TabsPage.UserInfo);
  }
}
