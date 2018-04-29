import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {photo} from "../../../JianLiPZ/newpz1/newpz1";
import {HttpService} from '../../../Service/HttpService';
import {ApiUrl} from "../../../../providers/Constants";
import {EPCSFile} from "../../../../Model/EPCSFile";
import {Utils} from "../../../../providers/Utils";
import {EPSecIssue, EPSecProblem, EPSecRisk} from "../../../../Model/EPSecIssue";
import {Project} from "../../ep-mate-entry/list/list";
import {ActionSheet, ActionSheetOptions} from "@ionic-native/action-sheet";

/**
 * Generated class for the SecIssRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-sec-iss-record',
  templateUrl: 'sec-iss-record.html',
})
export class SecIssRecordPage {
  photoes:photo[]=[];
  ePSecProblems:EPSecProblem[]= [];
  ePSecRisks:EPSecRisk[] =[];
  ePfiles:EPCSFile[] = [];
  EProject;
  EMPloyeeID;
  ePSecIssue:EPSecIssue;
  EPCSID:boolean = false;
  type;
  ToUplod;
  curProblems:EPSecProblem = new EPSecProblem();
  curRisks:EPSecRisk = new EPSecRisk();
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:HttpService,public  actionSheet:ActionSheet) {
    this.EProject = this.navParams.get("EProject");
    this.EMPloyeeID = this.navParams.get("EMPloyeeID");
    this.type = this.navParams.get("Type");
    if(this.type==1){
      this.EPCSID = true;
      this.ePSecIssue = this.navParams.get('EPSecIssue');
      this.initPhoto()
    }else if(this.type==0){
      this.ePSecIssue = new EPSecIssue(this.EMPloyeeID,this.EProject);
    }
    this.ToUplod = ApiUrl.slice(0,ApiUrl.length-4)+"1.html?FileUpPerson="+this.EMPloyeeID+"&EPCSID="+ this.ePSecIssue.EPCSID;
    console.log('ionViewDidLoad SecIssRecordPage');
    this.http.get(ApiUrl+'EPSecIssues/GetKeyType').subscribe(res=>{
      for(var i = 0;i<res.ePSecProblems.length;i++){
        var secproblem = new EPSecProblem();
        secproblem.EPSecProblemID = res.ePSecProblems[i].EPSecProblemID;
        secproblem.Desc = res.ePSecProblems[i].Desc;
        this.ePSecProblems.push(secproblem);
        if(this.type==1&&this.ePSecIssue.EPSecProblemID==res.ePSecProblems[i].EPSecProblemID){
          this.curProblems = res.ePSecProblems[i];
        }
      }
      for(var i = 0;i<res.ePSecRisks.length;i++){
        var secrisk = new EPSecRisk();
        secrisk.EPSecRiskID = res.ePSecRisks[i].EPSecRiskID;
        secrisk.Desc = res.ePSecRisks[i].Desc;
        this.ePSecRisks.push(secrisk);

        if(this.type==1&&this.ePSecIssue.EPSecRiskID==res.ePSecRisks[i].EPSecRiskID){
          this.curRisks = res.ePSecRisks[i];
        }
      }

      console.log(this.ePSecProblems);
    },error=>{
      alert("请求参数列表出错！");
    });
  }

  ionViewDidLoad() {

  }

  newSecIssues(IsSubmit){
    this.ePSecIssue.State = IsSubmit;
    this.ePSecIssue.EPSecProblemID = this.curProblems.EPSecProblemID;
    this.ePSecIssue.EPSecRiskID = this.curRisks.EPSecRiskID;
    var data = Utils.ParamsToString(this.ePSecIssue);

    this.http.post(ApiUrl+'EPSecIssues/PostEPSecIssue',data).subscribe(res=>{
      alert(res.ErrorMs);
      if(res.EPCSParentID!=-1){
        this.ePSecIssue.EPCSID = res.EPCSParentID;
        this.ToUplod = ApiUrl.slice(0,ApiUrl.length-4)+"1.html?FileUpPerson="+this.EMPloyeeID+"&EPCSID="+ this.ePSecIssue.EPCSID;
        this.EPCSID =true;
      }
    },error=>{
      alert(error);
    });
  }

  goBack(){
    this.navCtrl.pop();
  }
  initPhoto(){
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
    }
  }

  ionViewDidEnter(){
    if(this.ePSecIssue.EPCSID==''){

    }else {
      this.http.get(ApiUrl+'EPWitnSamples/GetEPFiles?EPCSID='+this.ePSecIssue.EPCSID).subscribe(res=>{
        this.ePSecIssue.EPCSParent.EPCSFiles = res;
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
  compareFn(e1: EPSecProblem, e2: EPSecProblem): boolean {
    return e1 && e2 ? e1.EPSecProblemID === e2.EPSecProblemID : e1 === e2;
  }
  compare1Fn(e1: EPSecRisk, e2: EPSecRisk): boolean {
    return e1 && e2 ? e1.EPSecRiskID === e2.EPSecRiskID : e1 === e2;
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
}
