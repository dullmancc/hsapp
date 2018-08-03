import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../Service/HttpService";
import {PZJLPage} from "./PZlist/PZJL";
import { AlertController ,ToastController } from 'ionic-angular';
import {ApiUrl} from "../../providers/Constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {EpMateEntryPage} from "../Work/ep-mate-entry/ep-mate-entry";
import {NormalPzPage} from "./normal-pz/normal-pz";
@IonicPage()
@Component({
  selector: 'page-JLProject',
  templateUrl: 'JLProject.html'
})
export class JLProjectPage {

  public mypro;
  public SumbitPz;
  public PassPz;
  public unSumbitPz;
  public pet = 'all';
  public me;
  public PZType;

  constructor(public navCtrl: NavController,
              private http: HttpService,
              private navp:NavParams,
              private alertCtrl:AlertController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public httpc:HttpClient,
              private cd:ChangeDetectorRef){
    this.mypro = this.navp.get('charNum');
    this.me = this.navp.get('userId');
    this.Load();
  }
  ionViewWillEnter(){

  }

  GoToExitRecord(item , type){
    switch (item.PZBelong.PZTypeID) {
      case 'PZConcrete':
    /**
        if (type < 2) {
          this.navCtrl.push(NormalPzPage, {'Pangzhan': item,'Type':1,'EmployeeID':this.me,'EProjectID':this.mypro.EProjectID,});
        } else {
          this.navCtrl.push(NormalPzPage, {'Pangzhan': item,'Type':2,'EmployeeID':this.me,'EProjectID':this.mypro.EProjectID,});
        }**/
        break;
      case 'PZGeneral':
        console.log(item);
        this.navCtrl.push(NormalPzPage, {'Pangzhan': item,'Type':type,'PZType':item.PZBelong.PZTypeID,'EmployeeID':this.me,'EProjectID':this.mypro.EProjectID,});
        break;
      default:
        break;
    }
  }

//Project/getPZBlong?EProjectId=6'
  Load(){
    let loader=this.loadingCtrl.create();
    loader.present();

    this.http.get(ApiUrl+'pangzhan/GetPZType').subscribe(res=>{
      this.PZType =res;
    },error=>{
      console.log(error);
      loader.dismiss();
    });

    this.http.get(ApiUrl+'Pangzhan/GetUserPangzhan?EProjectID='+this.mypro.EProjectID+'&EmployeeID='+this.me).subscribe(res => {
      console.log(res);
      this.SumbitPz=res.SumbitPz;
      this.PassPz=res.PassPz;
      this.unSumbitPz=res.unSumbitPz;
      loader.dismiss();
    }, error => {
      loader.dismiss();
      //错误信息
      alert(error);
    });
  }

  GetTime(itemtime){
    if(itemtime!=null && itemtime!=undefined){
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
  }

  goBack(){
    this.navCtrl.pop();
  }

  ToMyPZJL(pro){
      this.navCtrl.push(PZJLPage,{PZBL:pro,UserId:this.me});
  }

  newPZBL(){
    let alert=this.alertCtrl.create({
      title:"请选择旁站类型！",
      cssClass:'projectList'
    });

    for(let i = 0;i<this.PZType.length;i++){
      alert.addInput({
        type: 'radio',
        label: this.PZType[i].Desc,
        value: this.PZType[i].PZTypeID,
        checked: false
      });
    }
    alert.addButton({
      text: '确定',
      handler: data => {
        switch (data){
          case 'PZConcrete':
            this.navCtrl.push(NormalPzPage,{'EmployeeID':this.me,'EProjectID':this.mypro.EProjectID,'PZType':data,'Type':0});
            break;
          case 'PZGeneral':
            this.navCtrl.push(NormalPzPage,{'EmployeeID':this.me,'EProjectID':this.mypro.EProjectID,'PZType':data,'Type':0});
            break;
          default:
        }
      }
    });    alert.present();
  }

  Test(){
    /*
    var httphead = new HttpHeaders({"Content-Type":'application/json',"Authorization":'Bearer '+sessionStorage.getItem('accessToken')});
    var data ={

      Pangzhan:{
        EndTime:'2018-06-06 10:36:20.000',
        EmployeeTransferID:null,
        ConstructionCase:'我是交班的第三个人',
        SupervisorCase:'我是交班的第三个人',
        FindPromble:'我是交班的第三个人',
        Suggestion:'我是交班的第三个人',
        PZBelongId:13,
        EPCSID:'',
        State:1,
        ConstructionNums:4,
        CheckNums:5,
        EPZState:1,
        EPCSParent:{
          EPCSID:'',
          EProjectID:'20180108-test1',
          EmployeeID:'E000001'
        },
        PZBelong:{
          PZBelongId:13,
          EProjectID:'20180108-test1',
          PZBelongName:'第二层混凝土浇筑',
          Process:'第二层墙',
          Part:'混凝土浇筑',
          ECUnitID:'ECUnit01',
          BeginTime:'2018-01-01 16:00:00.000',
          PZTypeID:'PZGeneral'
        }
      }
    };
    this.httpc.post('http://localhost:1857/api/pangzhan/PostPangzhan',data,{headers:httphead}).subscribe(res=>{
      console.log(res);
    },error=>{
      console.log(error);
    });*/
   }

}
