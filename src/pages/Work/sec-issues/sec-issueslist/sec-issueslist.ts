import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SecIssRecordPage} from "../sec-iss-record/sec-iss-record";
import {photo} from "../../../JianLiPZ/newpz1/newpz1";
import {ApiUrl} from "../../../../providers/Constants";

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
  ePfiles;
  photoes:photo[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ePSecIssue = this.navParams.get('EPSecIssue');
    this.ePfiles = this.ePSecIssue.EPCSParent.EPCSFiles;
    for(var i = 0;i<this.ePfiles.length;i++){
      var p = new  photo();
      var tupian = this.ePfiles[i].FileName.substr(this.ePfiles[i].FileName.lastIndexOf('.'));
      if(tupian=='.png'||tupian=='.jpg'||tupian=='.gif'||tupian=='.tiff'||tupian=='.svg'){
        p.src = ApiUrl.slice(0,ApiUrl.length-4)+ this.ePfiles[i].FilePath.substring(2);
        p.isPhoto = true;
      }else{
        p.src = this.ePfiles[i].FileName;
        p.isPhoto = false;
      }
      this.photoes.push(p);
      this.photoes[i].ePfile = this.ePfiles[i];
      console.log(this.photoes);
    }
  }
  goBack(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SecIssueslistPage');
  }
}
