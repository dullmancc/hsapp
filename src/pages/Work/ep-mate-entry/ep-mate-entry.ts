import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EPEntryResult, EPMateEntryType, EPMaterials} from "../../../Model/EPMaterials";
import {HttpService} from "../../Service/HttpService";
import {ApiUrl} from "../../../providers/Constants";
import {EPSecIssue, EPSecProblem, EPSecRisk} from "../../../Model/EPSecIssue";
import {photo} from "../../JianLiPZ/newpz1/newpz1";
import {EPCSFile} from "../../../Model/EPCSFile";
import {Utils} from "../../../providers/Utils";
import {ActionSheet, ActionSheetOptions} from "@ionic-native/action-sheet";

/**
 * Generated class for the EpMateEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-mate-entry',
  templateUrl: 'ep-mate-entry.html',
})
export class EpMateEntryPage {

  public ePMateEntryType:EPMateEntryType[];
  public ePEntryResult:EPEntryResult[];
  public photoes:photo[]=[];
  public ePfiles:EPCSFile[] = [];
  public ePMaterials:EPMaterials;
  public epmatecheck;
  public EmployeeID;
  public type;
  public ToUplod;
  public curResult:EPEntryResult;
  EPCSID:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpService,public  actionSheet:ActionSheet) {
    this.epmatecheck = this.navParams.get('EPMaterialsCheck');
    this.EmployeeID = this.navParams.get('EmployeeID');
    this.type = this.navParams.get("Type");

    if(this.type==1){
      this.EPCSID = true;
      this.ePMaterials = this.navParams.get('EPMaterials');
      this.initPhoto();

    }else if(this.type==0){
      this.ePMaterials = new EPMaterials(this.epmatecheck.ECUnit,this.EmployeeID,this.epmatecheck.EPCheckID);
    }
    this.ToUplod = ApiUrl.slice(0,ApiUrl.length-4)+"1.html?FileUpPerson="+this.EmployeeID+"&EPCSID="+ this.ePMaterials.EPCSID;

    this.http.get(ApiUrl+'EPMateEntries/GetMateType').subscribe(res=>{
      this.ePMateEntryType = res.ePMateEntryTypes;
      this.ePEntryResult = res.ePEntryResults;
      console.log(res);
      if(this.type==1){
        for(let s=0 ;s< this.ePEntryResult.length;s++){
          if(this.ePEntryResult[s].EPEntryResultID==this.ePMaterials.EPEntryResultID){
            this.curResult = this.ePEntryResult[s];
          }
        }
      }
      },error=>{
      alert(error);
    });

  }

  newSecIssues(IsSubmit){
    this.ePMaterials.State = IsSubmit;
    this.ePMaterials.EPEntryResultID = this.curResult.EPEntryResultID;
    this.ePMaterials.EPMateEntryTypeID = this.ePMateEntryType[0].EPMateEntryTypeID;
    var data = Utils.ParamsToString(this.ePMaterials);

    this.http.post(ApiUrl+'EPMateEntries/PostEPMatesEntry',data).subscribe(res=>{
      alert(res.ErrorMs);
      if(res.EPCSParentID!=-1){
        this.ePMaterials.EPCSID = res.EPCSParentID;
        this.ToUplod = ApiUrl.slice(0,ApiUrl.length-4)+"1.html?FileUpPerson="+this.EmployeeID+"&EPCSID="+ this.ePMaterials.EPCSID;
        this.EPCSID =true;
      }
    },error=>{
      alert(error);
    });
  }

  initPhoto(){
    this.ePfiles = this.ePMaterials.EPCSParent.EPCSFiles;
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
    }
  }

  ionViewDidEnter(){
    if(this.ePMaterials.EPCSID==''){

    }else {
        this.http.get(ApiUrl+'EPWitnSamples/GetEPFiles?EPCSID='+this.ePMaterials.EPCSID).subscribe(res=>{
          this.ePMaterials.EPCSParent.EPCSFiles = res;
          this.initPhoto();
        },error=>{
          alert(error);
        });
    }
  }

  deletePhoto(i:number){
    this.http.post(ApiUrl+'EPSecIssues/DeleteFile?FileID='+this.photoes[i].ePfile.EPSecFileID,{}).subscribe(res=>{
      if(0<=i&&i<=this.photoes.length-1)
      {
        for(let k=i;k<this.photoes.length-1;k++)
        {
          this.photoes[k]=this.photoes[k+1];
        }
        this.photoes.length--;
      }
    },error=>{
      alert("删除失败！");
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
        this.newSecIssues(0);
        CanLeave = true;
      }
      if (buttonIndex == 2){
        this.newSecIssues(1);
        CanLeave = true;
      }
      if(buttonIndex==3){
        CanLeave = false
      }
    });

    return CanLeave;
  }*/
  ionViewDidLoad() {
    console.log('ionViewDidLoad EpMateEntryPage');
  }
  goBack(){
    this.navCtrl.pop();
  }
  compare1Fn(e1:EPEntryResult, e2: EPEntryResult): boolean {
    return e1 && e2 ? e1.EPEntryResultID === e2.EPEntryResultID : e1 === e2;
  }
}
