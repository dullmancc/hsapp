import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {PZCheckRecord} from "../../../Model/PZConcreteSlumpRecord";

/**
 * Generated class for the PzCheckRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pz-check-record',
  templateUrl: 'pz-check-record.html',
})
export class PzCheckRecordPage {


  PZCheckRecords:PZCheckRecord[]=[];
  PZCheckShow:boolean[]=[];
  Pangzhan;
  callback;

 // curText1;
  curText;
  Type;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController) {
    this.Pangzhan = this.navParams.get('Pangzhan');
    this.PZCheckRecords = this.Pangzhan.PZCheckRecords;
    this.callback = this.navParams.get('callback');
    this.Type = this.navParams.get('Type');
    //this.PZCheckRecordStr = this.navParams.get('CheckRecordStr');

    let i = 0;
    this.curText = this.Pangzhan.Suggestion.replace('@','');
    if(this.Pangzhan.PZCheckRecords!=null){
      this.PZCheckRecords.forEach(V=>{
        if(V.PZCheckState == 0){
          this.PZCheckShow.push(true);
        }else {
          this.PZCheckShow.push(false);
        }
      });
      i++;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PzCheckRecordPage');
  }

  DeleteItem(index){
    this.PZCheckRecords.splice(index,1);
    this.PZCheckShow.splice(index,1);
  }


  left_zero_4(str) {
    if (str != null && str != '' && str != 'undefined') {
      if (str.length == 2) {
        return '00' + str;
      }
    }
    return str;
  }

  unicode(str){
    var value='';
    for (var i = 0; i < str.length; i++) {
      value += '\\u' + this.left_zero_4(parseInt(str.charCodeAt(i)).toString(16));
    }
    return value;
  }


  addNewCheck(i){
    let alert = this.alertCtrl.create({
      title: '检查项',
      message: '请输入新检查项名称',
      inputs: [
        {
          name: 'CheckName',
          placeholder: '检查项名称'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: '确定',
          handler: data => {
            let check = new PZCheckRecord();
            check.PZCheckType = i;
            check.Desc = data.CheckName;
            check.PangzhanID = this.Pangzhan.EPCSID;
            this.PZCheckRecords.push(check);
            this.PZCheckShow.push(true);
          }
        }
      ]
    });
    alert.present();
  }
  goBack(){
      this.navCtrl.pop();
  }

  save(){
    for(let i = 0;i<this.PZCheckShow.length;i++){
      if(this.PZCheckShow[i]){
        this.PZCheckRecords[i].PZCheckState = 0;
      }else{
        this.PZCheckRecords[i].PZCheckState = 1;
      }

    }
     this.Pangzhan.PZCheckRecords = this.PZCheckRecords;
     this.callback({'Pangzhan':this.Pangzhan});
     this.navCtrl.pop();
  }
}

