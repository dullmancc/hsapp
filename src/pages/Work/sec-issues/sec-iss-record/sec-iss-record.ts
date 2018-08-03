import { Component } from '@angular/core';
import {
  NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {HttpService} from '../../../Service/HttpService';
import {ApiUrl} from "../../../../providers/Constants";
import {Utils} from "../../../../providers/Utils";
import {EPSecIssue, EPSecProblem, EPSecRisk} from "../../../../Model/EPSecIssue";
import {ChoosePhotoService, Photo} from "../../../../providers/ChoosePhotoService";
import {SecRiskRecordPage} from "../sec-risk-record/sec-risk-record";
import {TabsPage} from "../../../tabs/tabs";

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
  employees;
  photoes:Photo[]=[];
  ePSecProblems:EPSecProblem[]= [];
  ePSecRisks:EPSecRisk[] =[];
  EProject;
  EMPloyeeID;
  //当前跟踪人
  curEmployee;
  //安全隐患类
  ePSecIssue:EPSecIssue;
  //页面类型 新建 or 保存
  type;
  //当前选择问题种类
  curProblems:EPSecProblem = new EPSecProblem();
  //当前选择风险评估
  curRisks:EPSecRisk = new EPSecRisk();
  //是否为危大工程
  isRiskProject=false;
  isClear=false;

  checkType=[{'option':'目测','value':0},{'option':'尺量','value':1},{'option':'检测','value':2}];

  init(){
    alert("this work!");
    this.initPhoto();
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http:HttpService,
              private choosephoto:ChoosePhotoService,
              public toastCtrl: ToastController,
              public platform:Platform) {
    /*添加从后台回到前台时间
    this.platform.ready().then(() => {
      var this_ = this;
      function mywork(){
        this_.http.get(ApiUrl+'EPWitnSamples/GetEPFiles?EPCSID='+this.ePMaterials.EPCSID).subscribe(res=>{
          alert("this work!");
          this_.ePSecIssue.EPCSParent.EPCSFiles = res;
          this_.initPhoto();
        },error=>{
          //alert(error);
        });
      }

      document.addEventListener('resume',mywork,false);
      });
      */
    //
    this.EProject = this.navParams.get("EProject");
    this.EMPloyeeID = this.navParams.get("EMPloyeeID");
    this.type = this.navParams.get("Type");
    if(this.type==1){
      this.ePSecIssue = this.navParams.get('EPSecIssue');
      this.initPhoto();
      this.choosephoto.InitParams(this.ePSecIssue.EPCSID,this.EMPloyeeID);
    }else if(this.type==0){
      this.ePSecIssue = new EPSecIssue(this.EMPloyeeID,this.EProject);
    }
    console.log('ionViewDidLoad SecIssRecordPage');

    //获得与这个项目关联的Employees
    this.http.get(ApiUrl+'Project/getEmployees?EProjectId='+this.EProject).subscribe(res=>{
      this.employees = res;
      this.employees.forEach(v=>{
        if(this.ePSecIssue.TrackEmployeeID==v.EmployeeID){
          this.curEmployee = v;
        }
      });
    },error=>{
      alert(error);
    });

    //获得拉下列表
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

  //初始化图片
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

  ionViewDidLoad() {

  }

  riskRecord(){
    this.navCtrl.push(SecRiskRecordPage,{'EProject':this.EProject,'EmployeeID':this.EMPloyeeID});
  }

  newSecIssues(IsSubmit){
    this.ePSecIssue.State = IsSubmit;
    this.ePSecIssue.EPSecProblemID = this.curProblems.EPSecProblemID;
    this.ePSecIssue.EPSecRiskID = this.curRisks.EPSecRiskID;
    if(this.ePSecIssue.EPNoticeListstate==true){
      this.ePSecIssue.EPNoticeListstate = 1;
    }else if(this.ePSecIssue.EPNoticeListstate==false){
      this.ePSecIssue.EPNoticeListstate = 0;
    }
    this.ePSecIssue.TrackEmployeeID = this.curEmployee.EmployeeID;
    var data = Utils.ParamsToString(this.ePSecIssue);

    this.http.post(ApiUrl+'EPSecIssues/PostEPSecIssue',data).subscribe(res=>{
      this.presentToast(res.ErrorMs);
      if(res.EPCSParentID!=-1){
        this.ePSecIssue.EPCSID = res.EPCSParentID;
        this.choosephoto.InitParams(this.ePSecIssue.EPCSID,this.EMPloyeeID);
      }
      if(IsSubmit==1){
        this.navCtrl.pop();
      }

    },error=>{
      this.presentToast(error.toString());
    });
  }

  goBack(){
    console.log(this.ePSecIssue.EPNoticeListstate);
    this.navCtrl.pop();
  }

  initPhoto(){
    let ePfiles = this.ePSecIssue.EPCSParent.EPCSFiles;
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
      p.isupload = true;
      this.photoes.push(p);
      this.photoes[i].ePfile = ePfiles[i];
    }
    this.choosephoto.InitPhoto(this.photoes);
  }

  compareFn(e1: EPSecProblem, e2: EPSecProblem): boolean {
    return e1 && e2 ? e1.EPSecProblemID === e2.EPSecProblemID : e1 === e2;
  }
  compare1Fn(e1: EPSecRisk, e2: EPSecRisk): boolean {
    return e1 && e2 ? e1.EPSecRiskID === e2.EPSecRiskID : e1 === e2;
  }
  compare2Fn(e1: any,e2:any): boolean {
    return e1 && e2 ? e1.EmployeeID === e2.EmployeeID : e1 === e2;
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
