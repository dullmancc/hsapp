import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {EPWitnSample} from "../../../../Model/EPWitnSample";
import {HttpService} from "../../../Service/HttpService";
import {Utils} from "../../../../providers/Utils";
import {ApiUrl} from "../../../../providers/Constants";

/**
 * Generated class for the EpWitRecordNumsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-wit-record-nums',
  templateUrl: 'ep-wit-record-nums.html',
})
export class EpWitRecordNumsPage {

  public callback;
  public ePMaterials;
  public fushi=[];
  public ePWitRecord:EPWitnSample[] = [];
  public EmployeeID;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpService,public toastCtrl: ToastController) {
    this.ePMaterials = this.navParams.get("EPMaterials");
    this.callback = this.navParams.get('callback');
    this.EmployeeID = this.ePMaterials.Employee_EmployeeID;
    this.ePMaterials.EPMateInfoForEntries.forEach(V=>{
      if(V.EPEntryResultID=="EPMR03"){
        let pro = new EPWitnSample();
        pro.EPMateInfoForEntryID = V.EPMateInfoForEntryID;
        pro.EmployeeID =this.EmployeeID;
        V.EPWitnSample = pro;
        this.ePWitRecord.push(pro);
        this.fushi.push(V);
      }
    });

  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpWitRecordNumsPage');
  }

  Finish(){
    for(let i = 0;i<this.ePWitRecord.length;i++){
      if(this.ePWitRecord[i].ReviewNums==''){
        this.presentToast("请填完复检数量!");
        return;
      }
    }

    this.ePWitRecord.forEach(V=>{
      let data = Utils.ParamsToString(V);
      this.http.post(ApiUrl+'EPWitnSamples/PostEPWitnSample',data).subscribe(res=>{

      },error2 => {
        this.presentToast("请求失败,请重新填写!");
      });
    });

    this.callback(this.ePMaterials);
    this.navCtrl.pop();
  }

  goBack(){
    this.navCtrl.pop();
  }
}
