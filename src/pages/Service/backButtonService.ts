import {Injectable}  from "@angular/core";
import {Platform,ToastController,App,NavController,Tabs} from "ionic-angular";
import {BackgroundMode} from "@ionic-native/background-mode";

@Injectable()
export class BackButtonService{
  backButtonPressed:boolean = false;
  constructor(public platform:Platform,
                public appCtrl:App,
                public toastCtrl:ToastController,public bg:BackgroundMode){

  }
  registerBackButtonAction(tabRef:Tabs):void{
    this.platform.registerBackButtonAction(()=>{
      let activeNav:NavController = this.appCtrl.getActiveNav();
      if(activeNav.canGoBack()){
        activeNav.pop();
      }else {
        if(tabRef==null||tabRef._selectHistory[tabRef._selectHistory.length-1]===tabRef.getByIndex(0).id){
          this.showExit();
        }else {
          tabRef.select(0);
        }
      }

    })
  }

  private showExit():void{
    if(this.backButtonPressed){
      this.bg.moveToBackground();
      console.log("Service Start OverBack");
    }else {
      this.toastCtrl.create({
        message:'再按一次退出应用',
        duration:2000,
        position:'top'
      }).present();
      this.backButtonPressed = true;
      setTimeout(()=>this.backButtonPressed=false,2000);

    }
  }
}
