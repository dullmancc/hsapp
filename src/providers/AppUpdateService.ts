import {Injectable} from "@angular/core";
import {HttpService} from "../pages/Service/HttpService";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {FileOpener} from "@ionic-native/file-opener";
import { File } from '@ionic-native/file';
import {AlertController, LoadingController, Platform} from "ionic-angular";

@Injectable()
export class AppUpdateService{

  load;
  now: number = 0;
  curVersion = '';
  UpdateVersion = '';
  UpdateCheckUrl = '';
  UploadUrl = '';
  timer1;
  downloadPath;
  //TransFile
  constructor(private http:HttpService,
              private File:File,
              private transfer: FileTransfer,
              private fileopen:FileOpener,
              private platform:Platform,
              private alertCtrl:AlertController,
              private loadCrt:LoadingController){

    //this.TransFile = transfer.create();
  /*
    this.TransFile.onProgress(progressEvent => {
        console.log('已经在下载');
        if (progressEvent.lengthComputable) {
          this.now = progressEvent.loaded / progressEvent.total;
          // 下载过程会一直打印，完成的时候会显示 1
          console.log(progressEvent.loaded / progressEvent.total);
        } else {

        }
      });
*/
      this.http.get('assets/data/AppConfig.json').subscribe(res=>{
          this.curVersion = res.version;
          this.UpdateCheckUrl = res.updateUrl;

       },error=>{
          //do something
      });

  }

  initializeDown(){
    if(this.platform.is('android')){
      this.downloadPath = this.File.externalDataDirectory + 'app_download_path';
      console.log('android:'+this.downloadPath);
      this.File.createDir(this.File.externalDataDirectory,'app_download_path',false).then((res)=>{
        console.log(res);
      });
      console.log(this.downloadPath);
    }else{
      this.downloadPath = this.File.dataDirectory + 'app_download_path';
      console.log('ios');
      this.File.createDir(this.File.dataDirectory,'app_download_path',false).then((res)=>{
        console.log(res);
      });
    }
  }


  UpdateCheck(){
    this.initializeDown();

    this.http.get(this.UpdateCheckUrl).subscribe(res=>{
        this.UpdateVersion = res.version;
        this.UploadUrl = res.updateUrl;
        if(this.curVersion==this.UpdateVersion){
          //do something;
        }else {
            console.log(this.UploadUrl);
            this.presentAlert('发现新版本是否更新','');
        }
    },error=>{

    });
  }

  download(){

    var TransFile: FileTransferObject = this.transfer.create();

    TransFile.onProgress(progressEvent => {
      console.log('已经在下载');
      if (progressEvent.lengthComputable) {
        this.now = progressEvent.loaded / progressEvent.total;
       // this.load.data.content= "下载进度: "+Math.floor(this.now)+"%";
        // 下载过程会一直打印，完成的时候会显示 1
         console.log(this.now);
        console.log(progressEvent.loaded / progressEvent.total);
      } else {

      }
    });

    this.timer1 = setInterval(() => {

      this.load.data.content = "下载进度: "+Math.floor(this.now*100)+"%";

      if(this.now>99){
        clearInterval(this.timer1)
      }

    }, 300);


    var uri = encodeURI(this.UploadUrl);
    console.log(uri);
    //const actionUrl = 'http://www.example.com/file.pdf';
    TransFile.download(uri, this.downloadPath+'/'+'android.apk',false, {}).then((entry) => {
      if(this.timer1) clearInterval(this.timer1);
      this.load.dismiss();
      console.log(this.downloadPath+'/'+'android.apk');
      this.fileopen.open(this.downloadPath+'/'+'android.apk', 'application/vnd.android.package-archive')
        .then(() => {
          console.log('打开成功');
        })
        .catch((error) => {
          console.log('打开失败'+error);
        });
    }, (error) => {
      // handle error
      this.load.dismiss();
      console.log(error);
    }).catch(() => {
      this.load.dismiss();
      console.log('下载失败');
    });;
  }

  //提示框
  presentAlert(title,subTitle){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,

      buttons: [{
        text:'确定',
        handler: data => {
          this.load  = this.loadCrt.create({
            content:'下载进度: 0%',
            dismissOnPageChange:false
          });
          this.load.present();

          this.download();

        }
      },
        {
          text:'取消',
          handler: data => {

          }
        }]
    });

    alert.present();
  }




  getFileMimeType(fileType: string): string {
    let mimeType: string = '';

    switch (fileType) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }
}
