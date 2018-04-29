import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../Service/HttpService";
import {PZJLPage} from "./PZlist/PZJL";
import { AlertController ,ToastController } from 'ionic-angular';
import {ApiUrl} from "../../providers/Constants";
@IonicPage()
@Component({
  selector: 'page-JLProject',
  templateUrl: 'JLProject.html'
})
export class JLProjectPage {

  public mypro;
  public mypzbl;
  public me;
  constructor(public navCtrl: NavController,private http: HttpService
              ,private navp:NavParams,private alertC:AlertController
              ,public toastCtrl: ToastController,private cd:ChangeDetectorRef){
    this.mypro = this.navp.get('charNum');
    this.me = this.navp.get('userId');
    this.Load();
  }
  ionViewDidEnter(){
    this.Load();
  }
//Project/getPZBlong?EProjectId=6'
  Load(){
    this.http.get(ApiUrl+'Project/getPZBlong?EProjectId='+this.mypro.EProjectID).subscribe(res => {
      this.mypzbl = res;
      console.log(this.mypzbl);
    }, error => {
      //错误信息
      alert(error);
    });
  }

  goBack(){
    this.navCtrl.pop();
  }

  ToMyPZJL(pro){
      this.navCtrl.push(PZJLPage,{PZBL:pro,UserId:this.me});
  }
  newPZBL(){
      let prompt = this.alertC.create({
        title: '创建旁站部位或工序',
        message: '请认真填写能识别该部位或工序的名称',
        inputs: [
          {
            name: '旁站描述',
            placeholder: 'X层的剪力墙',
            id:'pzmc',
          },
        ],
        buttons: [
          {
            text: '取消',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: '确定',
            handler: data => {
              console.log(data);
              let pzbl =new PZBelong();
              pzbl.PZBelongName = data.旁站描述;
              pzbl.EProjectID = this.mypro.EProjectID;
              pzbl.EPZState = 0;
              pzbl.PZBelongId = '';
              let res = 'PZBelongId='+pzbl.PZBelongId+'&PZBelongName='+pzbl.PZBelongName+'&EProjectID='+pzbl.EProjectID+'&EPZState='+ pzbl.EPZState;
              this.http.post(ApiUrl+'Pangzhan/PostPZbelong',res).subscribe(resp=>{
                let toast = this.toastCtrl.create({
                  message: '创建成功!',
                  duration: 3000
                });
                this.mypzbl.push(resp.pZBelong);
                this.cd.detectChanges();
                toast.present();
              },error=>{
                let toast = this.toastCtrl.create({
                  message: '创建失败!',
                  duration: 3000
                });
                toast.present();
              });
            }
          }
        ]
      });
      prompt.present();
  }
}
export class PZBelong{
  public PZBelongId:any;
  public PZBelongName:string;
  public EProjectID:string;
  public EPZState:number;
}
