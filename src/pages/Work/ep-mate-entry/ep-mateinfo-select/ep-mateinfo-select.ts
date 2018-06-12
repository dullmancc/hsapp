import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../../Service/HttpService";
import {ApiUrl} from "../../../../providers/Constants";
import {Utils} from "../../../../providers/Utils";

/**
 * Generated class for the EpMateinfoSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-mateinfo-select',
  templateUrl: 'ep-mateinfo-select.html',
})
export class EpMateinfoSelectPage {
  queryText;
  type;
  ProItem;
  ShowItem;
  data;
  callback;
  title;
  MaterialInfoID;
  constructor(public http:HttpService,public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController) {
    this.type = this.navParams.get('type');
    this.ProItem = this.navParams.get('materialInfos');
    this.MaterialInfoID = this.navParams.get('MaterialInfoID');
    this.ShowItem = this.ProItem;
    console.log(this.type);
    console.log(this.ProItem);
    this.callback = this.navParams.get('callback');
    switch (this.type){
      case 0:this.title='请选择材料';break;
      case 1:this.title='请选择品牌';break;
      case 2:this.title='请选择单位';break;
      case 3:this.title='请选择型号';break;
    }
  }

  SeletedFinish(){
     if(this.ShowItem.length==0){
       let confirm = this.alertCtrl.create({
         title: '新增信息',
         message: '您输入的选项未在标准库中，是否选择并同时添加入标准库？',
         buttons: [
           {
             text: '确定',
             handler: () => {
               switch (this.type){
                 case 0:let data = {
                          'MaterialInfoID':'',
                          'MaterialInfoName':this.queryText
                        };
                        var datastr = Utils.ParamsToString(data);
                        this.http.post(ApiUrl+'MaterialInfoes/PostMaterialInfo',datastr).subscribe(res=>{
                          this.callback({data:res,new:1});
                          this.navCtrl.pop();
                        },error=>{
                          alert(error);
                        });break;
                 case 1:let data1 = {
                          'MaterialBrandID':'',
                          'BrandName':this.queryText,
                          'MaterialInfoID':this.MaterialInfoID
                        };
                        var datastr = Utils.ParamsToString(data1);
                        this.http.post(ApiUrl+'MaterialInfoes/PostMaterialBrand',datastr).subscribe(res=>{
                          this.callback({data:res,new:1});
                          this.navCtrl.pop();
                        },error=>{
                          alert(error);
                        });break;
                 case 2:let data2 = {
                          'MaterialUnitID':'',
                          'UnitName':this.queryText,
                        };
                        var datastr = Utils.ParamsToString(data2);
                        this.http.post(ApiUrl+'MaterialInfoes/PostMaterialUnit',datastr).subscribe(res=>{
                          this.callback({data:res,new:1});
                          this.navCtrl.pop();
                        },error=>{
                          alert(error);
                        });break;
                 case 3:let data3 = {
                          'EPMaterialModelID':'',
                          'Desc':this.queryText,
                          'MaterialInfoID':this.MaterialInfoID
                        };
                        var datastr = Utils.ParamsToString(data3);
                        this.http.post(ApiUrl+'MaterialInfoes/PostMaterialModel',datastr).subscribe(res=>{
                            this.callback({data:res,new:1});
                            this.navCtrl.pop();
                        },error=>{
                            alert(error);
                        });break;
               }
             }
           },
           {
              text: '取消',
              handler:()=>{

              }
           }
         ]
       });
       confirm.present();
     }else{
       let confirm = this.alertCtrl.create({
         title: '选择内容为空',
         message: '您未选择任何选项，请选择后点击完成！',
         buttons: [
           {
             text: '确定',
             handler: () => {
               console.log('Agree clicked');
             }
           }
         ]
       });
       confirm.present();
     }
  }

  updateSchedule(){
    this.ShowItem =[];
    this.queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = this.queryText.split(' ').filter(w => !!w.trim().length);
    switch (this.type){
      case 0:    this.ProItem.forEach((item:any)=>{
                  if(item.MaterialInfoName.toLowerCase().indexOf(queryWords)>-1){
                      this.ShowItem.push(item);
                  }
                  });break;
      case 1:     this.ProItem.forEach((item:any)=>{
                  if(item.BrandName.toLowerCase().indexOf(queryWords)>-1){
                      this.ShowItem.push(item);
                  }
                  });break;
      case 2:     this.ProItem.forEach((item:any)=>{
                  if(item.UnitName.toLowerCase().indexOf(queryWords)>-1){
                    this.ShowItem.push(item);
                  }
                  });break;
      case 3:     this.ProItem.forEach((item:any)=>{
                  if(item.Desc.toLowerCase().indexOf(queryWords)>-1){
                    this.ShowItem.push(item);
                  }
                  });break;
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EpMateinfoSelectPage');
  }
  goBack(){
    this.navCtrl.pop();
  }
  Seleted(i){
    this.data = i
    this.callback({data:this.data,new:0});
    this.navCtrl.pop();
  }
}
