import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicPage, LoadingController, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {Utils} from "../../../providers/Utils";
import {ApiUrl} from "../../../providers/Constants";
import {EPWitnSample} from "../../../Model/EPWitnSample";
import {HttpService} from "../../Service/HttpService";
import {ChoosePhotoService, Photo} from "../../../providers/ChoosePhotoService";
import {EpMateEntryPage} from "../ep-mate-entry/ep-mate-entry";
import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {ActionSheet} from "@ionic-native/action-sheet";
import {FileTransfer} from "@ionic-native/file-transfer";

/**
 * Generated class for the EpWitSamplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-wit-sample',
  templateUrl: 'ep-wit-sample.html',
})
/**
 * *input EPMateForInfo
 *  EPMateForInfo EPEnterResultID "EPMR03"    =>EPWitnSample
 *
 */
export class EpWitSamplePage {

  public callback;
  public IsuploadPhoto = true;
  public EPMaterials:any[];
  public ePWitRecord:EPWitnSample[] = [];
  public ePWitRecordList=[];
  public curResult=[{'id':3,'Desc':'合格'},{'id':4,'Desc':'不合格'}];
  public photoes:any[]=[];
  public EmployeeID;
  public ResultList;
  public chooesphoto:ChoosePhotoService[]=[];
  constructor(private camera: Camera,
              private actionsheetCtrl:ActionSheetController,
              private actionSheet:ActionSheet,
              private imagePicker: ImagePicker,
              private transfer: FileTransfer,
              private loadingCtrl: LoadingController,
              public platform:Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              public http:HttpService,
              private alertCtrl:AlertController,
              //private choosephoto:ChoosePhotoService,
              public toastCtrl: ToastController) {

      this.callback = this.navParams.get('callback');
      this.EPMaterials = this.navParams.get('EPMaterials');
      let index = 0;
      this.EPMaterials.forEach(V=>{
        if(V.EPEntryResultID=="EPMR03"){
          V.EPWitnSample.ReportID = '';
          this.EmployeeID = V.EPWitnSample.EmployeeID;
          this.ePWitRecord.push(V.EPWitnSample);
          let pro= new ChoosePhotoService(this.camera,this.actionsheetCtrl,this.actionSheet,this.imagePicker,this.alertCtrl,this.transfer,this.loadingCtrl,this.toastCtrl,this.http);
          this.chooesphoto.push(pro);
          this.ePWitRecordList.push(index);
        }
        index++;
    });
  }

  newSecIssues(){
    for(let i =0;i<this.ePWitRecord.length;i++){
      if(this.ePWitRecord[i].ReportID==''){
        let alert = this.alertCtrl.create({
          title: '信息未完善',
          subTitle: '请完成信息后提交!',
          buttons: [{
            text:'确定',
            handler: data => {
            }
          }]
        });
        alert.present();
        return;
      }
    }

    if(this.photoes.length==0&&this.IsuploadPhoto){
      this.presentAlert('未选择证明图片上传', '请先确认后，再选择保存！');
    }else{
      this.ePWitRecord.forEach(V=>{
        V.State = V.State.id;
        var data = Utils.ParamsToString(V);
        this.http.post(ApiUrl+'EPWitnSamples/PostEPWitnSample',data).subscribe(res=>{
          this.presentToast(res.ErrorMs);
          let index = 0;
          this.EPMaterials.forEach(V=>{
            if(V.EPEntryResultID=="EPMR03"){
              V.EPWitnSample = this.ePWitRecord[index];
              index++;
            }
          });
          },error=>{
          this.presentToast(error.toString());
        });
      });

      this.callback(this.EPMaterials);
      this.navCtrl.pop();
    }

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EpWitSamplePage');
  }
  goBack(){
    this.navCtrl.pop();
  }
  compare1Fn(e1:any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }


  //提示框
  presentAlert(title,subTitle){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text:'确定',
        handler: data => {
            this.IsuploadPhoto = false;
            this.newSecIssues();
        }
      },
        {
          text:'取消',
          handler: data => {
            this.IsuploadPhoto = true;
          }
      }]
    });

    alert.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  addPhoto(i):void{
    this.chooesphoto[i].setUrl('EPWitnSamples','EPMateInfoForEntryID');
    this.chooesphoto[i].InitParams(this.ePWitRecord[i].EPMateInfoForEntryID,this.EmployeeID);
    this.photoes[i] = this.chooesphoto[i].addPhoto();
  }

  deletePhoto(i:number,j){
    this.chooesphoto[i].setUrl('EPWitnSamples','EPMateInfoForEntryID');
    this.photoes[i] = this.chooesphoto[i].deletePhoto(j);
  }

}
export class WitResultType{
  public id;
  public Desc;
  public constructor(id,Desc){
    this.id = id;
    this.Desc = Desc;
  }
}
