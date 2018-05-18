import {Injectable} from "@angular/core";
import {EPCSFile} from "../Model/EPCSFile";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ActionSheetController, AlertController, LoadingController, ToastController} from "ionic-angular";
import {ActionSheet} from "@ionic-native/action-sheet";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {Observable} from "rxjs/Observable";
import {HttpService} from "../pages/Service/HttpService";
import {Utils} from "./Utils";
import {ApiUrl} from "./Constants";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";

export class Photo
{
  public src:any;
  public isupload:boolean = false;
  public ePfile:EPCSFile;
  public isPhoto:boolean;
}
@Injectable()
export class ChoosePhotoService{
  private photoes:Photo[]=[];
  private loader;
  public EPCSID:string;
  public EmployeeID:string;

  constructor(private camera: Camera,
              private actionsheetCtrl:ActionSheetController,
              private actionSheet:ActionSheet,
              private imagePicker: ImagePicker,
              private alertCtrl:AlertController,
              private transfer: FileTransfer,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private http:HttpService){
    this.EmployeeID = '';
    this.EPCSID = '';
  }

  public InitPhoto(photoes){
    this.photoes = photoes;
  }

  public InitParams(EPCSID,EmployeeID){
    this.EPCSID =EPCSID;
    this.EmployeeID = EmployeeID;
  }

  //提示框
  presentAlert(){
    let alert = this.alertCtrl.create({
      title: '选择图片失败',
      subTitle: '请先保存后，再选择图片！',
      buttons: ['确认']
    });

    alert.present();
  }

  //提示气泡
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

  //一张图片上传   递归实现多张图片上传
  upFile(i) {
    //上传了跳过
    if(this.photoes[i].isupload){
      return this.upFile(i+1);
    }

    if (i < this.photoes.length) {
      var fileTransfer: FileTransferObject = this.transfer.create();
      //fileName->在服务端保持唯一性 不唯一会被覆盖
      let options: FileUploadOptions = {
        fileKey: 'ionicfile'+i.toString(),
        fileName: 'ionicfile'+i+'.png',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }

      let data = {'FileUpPerson':this.EmployeeID,'EPCSID':this.EPCSID};
      var datastr = Utils.ParamsToString(data);

      fileTransfer.upload(this.photoes[i].src, ApiUrl+'Pangzhan/PostFile?'+datastr, options)
        .then((data) => {
          //标记已上传
          this.photoes[i].isupload = true;
          //赋值EPSecFileID
          this.photoes[i].ePfile.EPSecFileID = JSON.parse(data.response).EPCSFileID;
          i++;
          //递归 上传下一张图片
          this.upFile(i);
        }, (err) => {
          console.log(err);
          this.loader.dismiss();
          this.presentToast(err);
        });
    }else{
      this.loader.dismiss();
      this.presentToast("图片上传成功！");
    }
  }

  uploadFile() {
    if(this.photoes.length==0){
      return;
    }
    this.loader = this.loadingCtrl.create({
      content: "图片上传中..."
    });
    this.loader.present();
    this.upFile(0);
  }

  //添加图片
  addPhoto():Photo[]{
    //先保存再选择
    if(this.EPCSID == ''){
      this.presentAlert();
      return [];
    }
    //相机配置
    const options0: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum:true
    };
    // 设置选项
    const options1: ImagePickerOptions = {
      maximumImagesCount:9,
      quality: 100
    };

    let actionSheet = this.actionsheetCtrl.create({
      title: '选择图片的方式',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: '相册',
          handler: () => {
            this.imagePicker.getPictures(options1).then((results) => {
              //每一张图片创建Photo类
              for (var i = 0; i < results.length; i++) {
                let p=new Photo();
                p.ePfile = new EPCSFile(this.EPCSID,this.EmployeeID);
                p.src=results[i];
                p.isupload = false;
                this.photoes.push(p);
              }
              if(i==this.photoes.length){
                this.uploadFile();
              }
              //选择完毕即上传
              //this.uploadFile();
            }, (err) => {
              console.log(err);
              console.log('获取图片失败');
            });
          }
        },
        {
          text: '拍照',
          handler: () => {
            this.camera.getPicture(options0).then((imageData) => {
              let i = this.photoes.length;
              let base64Image = 'data:image/jpeg;base64,' + imageData;
              let p=new Photo();
              p.ePfile = new EPCSFile(this.EPCSID,this.EmployeeID);
              p.src=base64Image;
              p.isupload = false;
              this.photoes.push(p);
              if(i==this.photoes.length){
                this.uploadFile();
              }
              }, (err) => {
              console.log(err);
            });
          }
        },
        {
          text: '取消',
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

    return this.photoes || [];
  }

  deletePhoto(i:number){
    this.http.post(ApiUrl+'Pangzhan/DeleteFile?FileID='+this.photoes[i].ePfile.EPSecFileID,{}).subscribe(res=>{
      console.log(res);
      if(0<=i&&i<=this.photoes.length-1)
      {
        for(let k=i;k<this.photoes.length-1;k++)
        {
          this.photoes[k]=this.photoes[k+1];
        }
        this.photoes.length--;
      }
    },error=>{
      console.log(error);
      alert("删除失败！");
    });

    return this.photoes || [];
  }

}
