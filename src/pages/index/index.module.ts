import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndexPage } from './index';
import {MySlidesComponent} from "../../components/my-slides/my-slides";
import {StackPanelComponent} from "../../components/stack-panel/stack-panel";

@NgModule({
  declarations: [
    IndexPage,
    MySlidesComponent,
    StackPanelComponent
  ],
  imports: [
    IonicPageModule.forChild(IndexPage),
  ],
  entryComponents:[IndexPage]
})
export class IndexPageModule {}
