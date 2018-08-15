import {Injectable} from "@angular/core";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ActionSheetController, AlertController, LoadingController, ToastController} from "ionic-angular";
import {ActionSheet} from "@ionic-native/action-sheet";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {Observable} from "rxjs/Observable";
import {HttpService} from "../pages/Service/HttpService";
import {Utils} from "./Utils";
import {ApiUrl} from "./Constants";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {HttpHeaders} from "@angular/common/http";
import {EPCSFile} from "../Model/EPCSFile";

export class Photo{
  public FileID;
  public src;//手机本地路径
  public type;//图片类型
  public hasUploaded;
  public isPhoto;
}

@Injectable()
export class PhotoService{
  public photoes:Photo[]=[];
  public loader;
  public paramValue;
  public actionUrl;
  public now=0;
  timer;
  constructor(private camera: Camera,
              private actionsheetCtrl:ActionSheetController,
              private actionSheet:ActionSheet,
              private imagePicker: ImagePicker,
              private alertCtrl:AlertController,
              private transfer: FileTransfer,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private http:HttpService){

  }

  InitPhoto(photoes){
    this.photoes = photoes;
  }

  SetParams(paramValue, url:string){
    this.paramValue=paramValue;
    this.actionUrl=url;
  }

  //提示框
  PresentAlert(){
    let alert = this.alertCtrl.create({
      title: '选择图片失败',
      subTitle: '请先保存后，再选择图片！',
      buttons: ['确认']
    });

    alert.present();
  }

  //提示气泡
  PresentToast(msg) {
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

  AddPhotoes():Photo[]{

    //先保存获取从属ID再选择
    if(this.paramValue == ''){
      this.PresentAlert();
      return [];
    }
    //相机配置
    const options0: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation : true,
      saveToPhotoAlbum:true,
      allowEdit:true
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
                console.log(results[i]);

                p.src=results[i];
                p.hasUploaded = false;
                this.photoes.push(p);
              }
              this.UploadFile();
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
              console.log(base64Image);
              let p=new Photo();
              p.src=base64Image;
              p.hasUploaded = false;
              this.photoes.push(p);
              this.UploadFile();
            }, (err) => {
              console.log(err+'is error');
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

  deletePhoto(i:number) {
    //待修改
    this.http.post(ApiUrl+'File/'+this.actionUrl+'?FileID=' + this.photoes[i].FileID, {}).subscribe(res => {
      console.log(res);
      if (0 <= i && i <= this.photoes.length - 1) {
        for (let k = i; k < this.photoes.length - 1; k++) {
          this.photoes[k] = this.photoes[k + 1];
        }
        this.photoes.length--;
      }
    }, error => {
      console.log(error);
      alert("删除失败！");
    });
  }

  UploadFile() {
    if(this.photoes.length==0){
      return;
    }
    this.loader = this.loadingCtrl.create({
      content: "图片上传中 进度: "+Math.floor(this.now)+"%"
    });
    this.loader.present();
    this.Upload(0);
  }

  Upload(index){
    if(index < this.photoes.length){
      if(this.photoes[index].hasUploaded){
        return this.Upload(index+1);
      }
    }

    console.log("i: "+index+",length: "+this.photoes.length);
    if (index < this.photoes.length) {
      var fileTransfer: FileTransferObject = this.transfer.create();
      //fileName->在服务端保持唯一性 不唯一会被覆盖
      let options: FileUploadOptions = {
        fileKey: 'ionicfile'+index.toString(),
        fileName: 'ionicfile'+index+'.png',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }

      fileTransfer.onProgress(progressEvent => {
        if (progressEvent.lengthComputable) {
          this.now = progressEvent.loaded / progressEvent.total;
        } else {

        }
      });

      this.timer = setInterval(() => {
        this.loader.data.content = "图片上传中 进度: "+Math.floor(this.now*100)+"%";

        console.log(this.loader);
        if(this.now>0.99){
          clearInterval(this.timer)
        }

      }, 300);

      let data;
      var datastr;
      data = {'ID':this.paramValue};
      datastr = Utils.ParamsToString(data);

      fileTransfer.upload(this.photoes[index].src, ApiUrl+'File/'+this.actionUrl+'?'+datastr, options).then((data) => {
          if(this.timer) clearInterval(this.timer);
          //标记已上传
          this.photoes[index].hasUploaded = true;
          this.photoes[index].FileID=JSON.parse(data.response).EPCSFileID;
          //递归 上传下一张图片
          this.Upload(++index);

        }, (err) => {
          console.log(err);
          this.photoes.slice(index,1);
          this.PresentToast(err);

          console.log('Error: '+index+",photo length: "+this.photoes.length);
          //递归 上传下一张图片
          this.Upload(++index);
        });
    }else{
      console.log('DIsmiss End');
      this.loader.dismiss();
      this.PresentToast("图片上传成功！");
    }
  }

}
