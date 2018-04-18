import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../Service/HttpService";
import {PZJLPage} from "./PZlist/PZJL";
import { AlertController ,ToastController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-JLProject',
  templateUrl: 'JLProject.html'
})
export class JLProjectPage {

  public mypro;
  public mypzbl;
  public me;
  public url:string;
  constructor(public navCtrl: NavController,private http: HttpService
              ,private navp:NavParams,private alertC:AlertController
              ,public toastCtrl: ToastController,private cd:ChangeDetectorRef){
    this.url = 'http://193.112.12.241/HSWebApi/api/';
    this.mypro = this.navp.get('charNum');
    this.me = this.navp.get('userId');
    this.Load();
  }
//Project/getPZBlong?EProjectId=6'
  Load(){
    this.http.get(this.url+'Project/getPZBlong?EProjectId='+this.mypro.EProjectID).subscribe(res => {
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
      this.navCtrl.push(PZJLPage,{Project:this.mypro,PZBL:pro,UserId:this.me});
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
              pzbl.Descrb = data.旁站描述;
              pzbl.EProjectID = this.mypro.EProjectID;
              pzbl.EPZState = 0;
              pzbl.PZBelongId = '';
              let res = 'PZBelongId='+pzbl.PZBelongId+'&Descrb='+pzbl.Descrb+'&EProjectID='+pzbl.EProjectID+'&EPZState='+ pzbl.EPZState;
              this.http.post(this.url+'Pangzhan/PostPZbelong',res).subscribe(resp=>{
                let toast = this.toastCtrl.create({
                  message: '创建成功!',
                  duration: 3000
                });
                this.mypzbl.push(resp);
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
  public Descrb:string;
  public EProjectID:string;
  public EPZState:number;
}
