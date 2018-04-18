import { Component } from '@angular/core';
import {NavController, ModalController, AlertController,App} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {TabsPage} from "../tabs/tabs";
import {HttpService} from "../Service/HttpService";
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  public name:string;
  public RealName:string;
  public Trans;
  public imageURI;

  public path;
  constructor(public navCtrl: NavController,public modal:ModalController,private http: HttpService,private transfer: FileTransfer,
              private file: File,private app:App,private alertCtrl: AlertController) {
       this.name = TabsPage.UserInfo.employees.EmployeeID;
       this.RealName = TabsPage.UserInfo.employees.RealName;
       this.Trans = transfer.create();
        //头像url
       this.imageURI ="http://193.112.12.241/Uploads/1.jpg";
  }

  logOut(){
    let alert = this.alertCtrl.create({
      title: '退出登录',
      message: '你确定要退出登录吗?',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            LoginPage.Login = false;
            this.app.getRootNav().setRoot(TabsPage);       //3.调用this.app.getRootNav() 从根页面跳转就可以了
            setTimeout(() => {
              //this.navCtrl.popToRoot();
            },1000);
          }
        }
      ]
    });
    alert.present();
  }
}
