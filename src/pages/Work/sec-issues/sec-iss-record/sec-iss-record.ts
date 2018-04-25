import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {photo} from "../../../JianLiPZ/newpz1/newpz1";
import {HttpService} from '../../../Service/HttpService';
import {ApiUrl} from "../../../../providers/Constants";

/**
 * Generated class for the SecIssRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sec-iss-record',
  templateUrl: 'sec-iss-record.html',
})
export class SecIssRecordPage {
  photoes:photo[]=[];
  EPSecType:any[];
  EProject;
  EMPloyeeID;
  gaming;
  risk;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpService) {
    this.EProject = this.navParams.get("EProject");
    this.EMPloyeeID = this.navParams.get("EMPloyeeID");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SecIssRecordPage');
    this.http.get(ApiUrl+'EPSecIssues/GetKeyType').subscribe(res=>{
      this.EPSecType = res;
    },error=>{
      alert("请求参数列表出错！");
    })
  }
  newSecIssues(){

  }

  goBack(){
    this.navCtrl.pop();
  }

  deletePhoto(i:number){
    if(0<=i&&i<=this.photoes.length-1)
    {
      for(let k=i;k<this.photoes.length-1;k++)
      {
        this.photoes[k]=this.photoes[k+1];
      }
      this.photoes.length--;
    }
  }
}
