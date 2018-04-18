import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndexPage } from './index';
import {MySlidesComponent} from "../../components/my-slides/my-slides";

@NgModule({
  declarations: [
    IndexPage,
    MySlidesComponent,
  ],
  imports: [
    IonicPageModule.forChild(IndexPage),
  ],
  entryComponents:[IndexPage]
})
export class IndexPageModule {}
