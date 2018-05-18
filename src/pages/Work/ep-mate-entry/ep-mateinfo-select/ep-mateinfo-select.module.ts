import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EpMateinfoSelectPage } from './ep-mateinfo-select';

@NgModule({
  declarations: [
    EpMateinfoSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(EpMateinfoSelectPage),
  ],
})
export class EpMateinfoSelectPageModule {}
