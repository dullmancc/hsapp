import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiUrl} from "../../../../providers/Constants";
import {Photo} from "../../../../providers/ChoosePhotoService";

/**
 * Generated class for the SecIssueslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-sec-issueslist',
  templateUrl: 'sec-issueslist.html',
})
export class SecIssueslistPage {
  ePSecIssue;
  photoes:Photo[]=[];
  imgpath='assets/imgs/common/down.png';
  IsDown = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ePSecIssue = this.navParams.get('EPSecIssue');
    let ePfiles = this.ePSecIssue.EPCSParent.EPCSFiles;
    for(var i = 0;i<ePfiles.length;i++){
      var p = new  Photo();
      var tupian = ePfiles[i].FileName.substr(ePfiles[i].FileName.lastIndexOf('.'));
      if(tupian=='.png'||tupian=='.jpg'||tupian=='.gif'||tupian=='.tiff'||tupian=='.svg'){
        p.src = ApiUrl.slice(0,ApiUrl.length-4)+ ePfiles[i].FilePath.substring(2);
        p.isPhoto = true;
      }else{
        p.src = ePfiles[i].FileName;
        p.isPhoto = false;
      }
      this.photoes.push(p);
      this.photoes[i].ePfile = ePfiles[i];
      console.log(this.photoes);
    }
  }
  goBack(){
    this.navCtrl.pop();
  }

  Down(){
    if(this.IsDown){
      this.imgpath = 'assets/imgs/common/up.png';
    }else {
      this.imgpath = 'assets/imgs/common/down.png';
    }
    this.IsDown = !this.IsDown;
  }

  GetTime(itemtime){
    let dateitem;
    dateitem = itemtime.substring(0,itemtime.indexOf('-'))+'年'+itemtime.substring(itemtime.indexOf('-')+1,itemtime.indexOf('T'))+itemtime.substring(itemtime.indexOf('T')+1);
    let year =itemtime.slice(0,4);
    let nowyear = new Date().getFullYear().toString();
    let month = dateitem.slice(5,7);
    let nowmonth = (new Date().getMonth()+1).toString();
    if(nowmonth.length==1){
      nowmonth = '0'+nowmonth;
    }
    let day  = dateitem.slice(8,10);
    let nowday = new  Date().getDate();
    // 08:00
    let hourmintes = dateitem.substr(dateitem.length-8,5);
    //04-27 08:00
    let monthhour =  dateitem.substr(5,dateitem.length-8).slice(0,5)+' '+hourmintes;
    //2018年04-27
    let YearMonth = dateitem.substr(0,10);
    if(year==nowyear){
      if(month==nowmonth&&day == nowday){
        return hourmintes;
      }else {
        return monthhour;
      }
    }else {
      return YearMonth;
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SecIssueslistPage');
  }
}
