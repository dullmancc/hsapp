import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {HttpService} from "../../Service/HttpService";
import {Newpz1Page} from "../newpz1/newpz1";
import {ExitPzRecordPage} from "../exit-pz-record/exit-pz-record";
import {NormalPzPage} from "../normal-pz/normal-pz";
import {IonicPage} from "ionic-angular";
import {ApiUrl} from "../../../providers/Constants";

@IonicPage()
@Component({
  selector: 'page-PZJL',
  templateUrl: 'PZJL.html'
})


export class PZJLPage {
  flag:boolean[]=[true,true,true];
  iconName:string[]=["arrow-dropright","arrow-dropright","arrow-dropright"];
  hiddenItem:boolean[]=[true,true,true];
  recordClasses:string[]=["我未完成的表单","上一个人提交的表单","我完成的表单"];
  public mypro;
  public userid;
  public pzbl;
  public SumbitPz;
  public PassPz
  public unSumbitPz;
  public isLoad: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl:ModalController,public alertCtrl:AlertController,private  http:HttpService) {
    this.userid = this.navParams.get('UserId');
    this.pzbl = this.navParams.get('PZBL');
    this.Load();
  }

  ionViewDidEnter(){
    this.Load();
  }

  Load(){
    this.isLoad = true;
    this.http.post(ApiUrl+'Project/GetMyPangzhan?PZBelongId='+this.pzbl.PZBelongId+'&EProjectId='+this.pzbl.EProjectID+'&EmployeeId='+this.userid,{}).subscribe((res:any)=>{
      this.SumbitPz = res.SumbitPz;
      this.unSumbitPz = res.unSumbitPz;
      this.PassPz = res.PassPz;
      console.log(res);
      this.isLoad = false;
    },error2 => {
      alert(error2);
    });
    /*
    this.http.post('http://192.168.43.30/HSWebApi/api/Project/GetMyPangzhan?PZBelongId='+this.pzbl.PZBelongId+'&EProjectId='+this.mypro.EProjectID+'&EmployeeId='+this.userid,{}).subscribe((res:any)=>{
      this.SumbitPz = res.SumbitPz;
      this.unSumbitPz = res.unSumbitPz;
      this.PassPz = res.PassPz;
      console.log(res);
      this.isLoad = false;
    },error2 => {
      alert(error2);
    });*/
  }


  //展开和收缩列表
  togglelist(i):void{
    this.flag[i]=!this.flag[i];
    if(!this.flag[i]){
      this.iconName[i]="arrow-dropdown";
      this.hiddenItem[i]=false;
    }
    else{
      this.iconName[i]="arrow-dropright";
      this.hiddenItem[i]=true;
    }
  }

  ToRecord(record,i){
    this.navCtrl.push(ExitPzRecordPage,{record:record,type:i});
  }

  goBack(){
    this.navCtrl.pop();
  }

  getRecord(recordClass){
    if(recordClass==this.recordClasses[0])
      return this.unSumbitPz;

    if(recordClass==this.recordClasses[1])
      return this.PassPz;

    if(recordClass==this.recordClasses[2])
      return this.SumbitPz;
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

  newRecord(){
    let alert=this.alertCtrl.create({
      title:"请选择您需要新建的旁站记录类型！",
      cssClass:'projectList'
    });

    alert.addInput({
      type: 'radio',
      label: '混凝土浇筑旁站',
      value: 'hltPZ',
      checked: true
    });/*
    alert.addInput({
      type: 'radio',
      label: '砼旁站',
      value: 'tPZ',
      checked:false
    });*/
    alert.addInput({
      type: 'radio',
      label: '普通旁站',
      value: 'ptpz',
      checked:false
    });
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        if(data=='hltPZ')
        {
          let modal=this.modalCtrl.create(Newpz1Page,{userid:this.userid,pzbl:this.pzbl});
          modal.present();
        }
        if(data=='tPZ')
        {
        // let modal=this.modalCtrl.create(Newpz2Page);
        //  modal.present();
        }
        if(data=='ptpz')
        {
          let modal=this.modalCtrl.create(NormalPzPage,{userid:this.userid,pzbl:this.pzbl});
          modal.present();
        }
      }
    });
    alert.present();
  }
}
