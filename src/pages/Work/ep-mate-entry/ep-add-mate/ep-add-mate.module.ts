import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EpAddMatePage } from './ep-add-mate';
import {AddMateComponent} from "../../../../components/add-mate/add-mate";
import {MyApp} from "../../../../app/app.component";

@NgModule({
  declarations: [
    EpAddMatePage,
    AddMateComponent,
  ],
  entryComponents:[
    AddMateComponent,
  ],
  imports: [
    IonicPageModule.forChild(EpAddMatePage),
  ],
})
export class EpAddMatePageModule {}
