import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MySlidesComponent} from "../../components/my-slides/my-slides";
import { HomePage } from './home';
import {MyworkComponent} from "../../components/mywork/mywork";

@NgModule({
  declarations: [
    HomePage,
    MyworkComponent
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
