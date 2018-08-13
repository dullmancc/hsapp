import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {HttpModule} from "@angular/http";
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HttpService} from "../pages/Service/HttpService";

import { ActionSheet } from '@ionic-native/action-sheet';
import { ImagePicker} from '@ionic-native/image-picker';
import {BackgroundMode} from "@ionic-native/background-mode";
import {HttpClientModule,HttpClientJsonpModule} from "@angular/common/http";
import {JsonpModule} from "@angular/http";
import {BackButtonService} from "../pages/Service/backButtonService";
import {AboutPageModule} from "../pages/about/about.module";
import {ContactPageModule} from "../pages/contact/contact.module";
import {ExitPzRecordPageModule} from "../pages/JianLiPZ/exit-pz-record/exit-pz-record.module";
import {HomePageModule} from "../pages/home/home.module";
import {JLProjectPageModule} from "../pages/JianLiPZ/JLProject.module";
import {ListPageModule} from "../pages/Work/ep-mate-entry/list/list.module";
import {LoginPageModule} from "../pages/login/login.module";
import {NormalPzPageModule} from "../pages/JianLiPZ/normal-pz/normal-pz.module";
import {ObservationPageModule} from "../pages/Work/observation/observation.module";
import {ProjectPageModule} from "../pages/Project/project.module";
import {PZJLPageModule} from "../pages/JianLiPZ/PZlist/PZJL.module";
import {TabsPageModule} from "../pages/tabs/tabs.module";
import {BeautyDirective} from "../pages/Service/CSSEL";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {IndexPageModule} from "../pages/index/index.module";
import {GoodsService} from "../providers/goods-service";
import {SecIssuesPageModule} from "../pages/Work/sec-issues/sec-issues.module";
import {SecIssRecordPageModule} from "../pages/Work/sec-issues/sec-iss-record/sec-iss-record.module";
import {EpAddMatePageModule} from "../pages/Work/ep-mate-entry/ep-add-mate/ep-add-mate.module";
import {ChoosePhotoService} from "../providers/ChoosePhotoService";
import {AppUpdateService} from "../providers/AppUpdateService";
import {FileOpener} from "@ionic-native/file-opener";
import {QualityGJService} from "../providers/GangJinQualityService";
import {SecRiskRecordPageModule} from "../pages/Work/sec-issues/sec-risk-record/sec-risk-record.module";
import {EpMateCheckListPageModule} from "../pages/Work/ep-mate-check-list/ep-mate-check-list.module";
import {InspectionPage} from "../pages/Work/Inspection/inspection/inspection";
import {PhotoService} from "../providers/PhotoService";
import {InspectionPageModule} from "../pages/Work/Inspection/inspection/inspection.module";

@NgModule({
  declarations: [
    MyApp,
    BeautyDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    JsonpModule,
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:true,
      preloadModules:true
    }),
    EpAddMatePageModule,
    EpMateCheckListPageModule,
    IndexPageModule,
    AboutPageModule,
    ContactPageModule,
    ExitPzRecordPageModule,
    HomePageModule,
    JLProjectPageModule,
    ListPageModule,
    LoginPageModule,
    NormalPzPageModule,
    ObservationPageModule,
    ProjectPageModule,
    PZJLPageModule,
    TabsPageModule,
    SecIssuesPageModule,
    SecRiskRecordPageModule,
    InspectionPageModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    FileTransferObject,
    FileOpener,
    File,
    ActionSheet,
    ImagePicker,
    Camera,
    BackgroundMode,
    HttpService,
    BackButtonService,
    AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoodsService,
    ChoosePhotoService,
    PhotoService,
    AppUpdateService,
    QualityGJService,
  ]
})
export class AppModule {}
