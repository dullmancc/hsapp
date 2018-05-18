import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {Utils} from "../../../providers/Utils";
import {ApiUrl} from "../../../providers/Constants";
import {EPWitnSample} from "../../../Model/EPWitnSample";
import {HttpService} from "../../Service/HttpService";
import {ChoosePhotoService, Photo} from "../../../providers/ChoosePhotoService";

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
export class EpWitSamplePage {

  public ePWitSamples:EPWitnSample;
  public curResult:WitResultType;
  public ResultList:WitResultType[]= [];
  public photoes:Photo[]=[];
  public epmatecheck;
  public EmployeeID;
  constructor(public platform:Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              public http:HttpService,
              private choosephoto:ChoosePhotoService,
              public toastCtrl: ToastController) {

      this.ePWitSamples = this.navParams.get('EPWitSamples');
      this.epmatecheck = this.navParams.get('EPMaterialsCheck');
      this.EmployeeID = this.navParams.get('EmployeeID');
      this.curResult = new WitResultType(-1,'');

      if(typeof this.ePWitSamples ==='undefined'){
        this.ePWitSamples = new EPWitnSample();
        this.ePWitSamples.Employee_EmployeeID = this.EmployeeID;
        this.ePWitSamples.EPCheckID = this.epmatecheck.EPCheckID;
        this.ePWitSamples.ECUnitID = this.epmatecheck.ECUnit;
      }else {
        this.initPhoto();
        this.choosephoto.InitParams(this.ePWitSamples.EPCSID,this.EmployeeID);
      }

      this.initList();
  }

  newSecIssues(){
    if(this.curResult.id == -1){
      alert('请选择见证取样状态!');
      return;
    }
    this.ePWitSamples.State = this.curResult.id;
    var data = Utils.ParamsToString(this.ePWitSamples);

    this.http.post(ApiUrl+'EPWitnSamples/PostEPWitSamp',data).subscribe(res=>{
      this.presentToast(res.ErrorMs);
      if(res.EPCSParentID!=-1){
        this.ePWitSamples.EPCSID = res.EPCSParentID;
        this.choosephoto.InitParams(this.ePWitSamples.EPCSID,this.EmployeeID);
      }
    },error=>{
      this.presentToast(error.toString());
    });
  }

  /*
  ionViewCanLeave() :boolean {
    let buttonLabels = ['保存','提交','取消'];

    const options: ActionSheetOptions = {
      title: '离开',
      buttonLabels: buttonLabels,
      addDestructiveButtonWithLabel: '取消',
      androidTheme: 5,
      destructiveButtonLast: true
    };

    let CanLeave;

    this.actionSheet.show(options).then((buttonIndex: number) => {
      if (buttonIndex == 1) {
        this.newSecIssues();
        CanLeave = true;
      }
      if (buttonIndex == 2){
        this.newSecIssues();
        CanLeave = true;
      }
      if(buttonIndex==3){
        CanLeave = false
      }
    });

    return CanLeave;
  }
*/

  /**EPEntryResult
   0   --  抽样中
   1   --  送审中
   2   --  复审中
   3   --  合格
   4   --  不合格
   **/
  initList(){
    let rt1 = new WitResultType(0,'抽样中');
    let rt2 = new WitResultType(1,'送审中');

    let rt3 = new WitResultType(2,'复审中');
    let rt4 = new WitResultType(3,'合格');

    let rt5 = new WitResultType(4,'不合格');
    this.ResultList.push(rt1);
    this.ResultList.push(rt2);
    this.ResultList.push(rt3);
    this.ResultList.push(rt4);
    this.ResultList.push(rt5);
    for(let j = 0;j<this.ResultList.length;j++){
      if(this.ePWitSamples.State==this.ResultList[j].id){
          this.curResult =this.ResultList[j];
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpWitSamplePage');
  }
  goBack(){
    this.navCtrl.pop();
  }
  compare1Fn(e1:WitResultType, e2: WitResultType): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  initPhoto(){
    let ePfiles = this.ePWitSamples.EPCSParent.EPCSFiles;
    this.photoes = [];
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
    }
    this.choosephoto.InitPhoto(this.photoes);
  }

  ionViewDidEnter(){
    if(this.ePWitSamples.EPCSID==''){

    }else {
      this.http.get(ApiUrl+'EPWitnSamples/GetEPFiles?EPCSID='+this.ePWitSamples.EPCSID).subscribe(res=>{
        this.ePWitSamples.EPCSParent.EPCSFiles = res;
        this.initPhoto();
      },error=>{
        alert(error);
      });
    }
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

  addPhoto():void{
    this.photoes = this.choosephoto.addPhoto();
  }

  deletePhoto(i:number){
    this.photoes = this.choosephoto.deletePhoto(i);
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
