import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PZConcreteSlumpRecord, PZTongRecord} from "../../../Model/PZConcreteSlumpRecord";
import {NormalPzPage} from "../normal-pz/normal-pz";

/**
 * Generated class for the PzShiGongPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pz-shi-gong',
  templateUrl: 'pz-shi-gong.html',
})
export class PzShiGongPage {

  TongiconName=[];
  SlumpiconName=[];
  Pangzhan;
  callback;
  PZType='';
  PZTongShow:boolean[] =[];
  PZTongRecords:PZTongRecord[]=[];
  PZSlumpRecord:PZConcreteSlumpRecord[]=[];
  PZSlumpShow:boolean[] =[];
  Type;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.Pangzhan = this.navParams.get('Pangzhan');
    this.callback = this.navParams.get('callback');
    this.PZType = this.navParams.get('PZType');
    this.Type = this.navParams.get('Type');
    console.log(this.Type);
    switch (this.PZType){
      case 'PZConcrete':
        this.Pangzhan.PZConcreteSlumpRecords = this.PZSlumpRecord;
        this.Pangzhan.PZTongRecords = this.PZTongRecords;
        break;
      case 'PZGeneral':

        break;
      default:break;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PzShiGongPage');
  }

  addTong(){
    let pztong = new PZTongRecord();
    pztong.PZConcreteID = this.Pangzhan.EPCSID;
    this.PZTongRecords.push(pztong);
    this.PZTongShow.push(true);
    this.TongiconName.push('arrow-dropdown');
  }

  addSlump(){
    let pzslump = new PZConcreteSlumpRecord();
    pzslump.PZConcreteID = this.Pangzhan.EPCSID;
    this.PZSlumpRecord.push(pzslump);
    this.PZSlumpShow.push(true);
    this.SlumpiconName.push('arrow-dropdown');
  }

  deleteSlump(index){
    this.PZSlumpShow.splice(index,1);
    this.PZSlumpRecord.splice(index,1);
    this.SlumpiconName.splice(index,1);
  }

  deleteTong(index){
    this.PZTongShow.splice(index,1);
    this.PZTongRecords.splice(index,1);
    this.TongiconName.splice(index,1);
  }

  onSlumpToggle(i) {
    this.PZSlumpShow[i] = !this.PZSlumpShow[i];
    if (this.PZSlumpShow[i]) {
      this.SlumpiconName[i] = 'arrow-dropdown';
    } else {
      this.SlumpiconName[i] = 'arrow-dropright';
    }
  }


  onToggle(i) {
    this.PZTongShow[i] = !this.PZTongShow[i];
    if (this.PZTongShow[i]) {
      this.TongiconName[i] = 'arrow-dropdown';
    } else {
      this.TongiconName[i] = 'arrow-dropright';
    }
  }

  goBack(){
    this.navCtrl.pop();
  }
  save(){
    switch (this.PZType){
      case 'PZConcrete':
        this.Pangzhan.PZConcreteSlumpRecords = this.PZSlumpRecord;
        this.Pangzhan.PZTongRecords = this.PZTongRecords;
        break;
      case 'PZGeneral':

        break;
      default:break;
    }
    this.callback(this.Pangzhan);
    this.navCtrl.pop();
  }
}
