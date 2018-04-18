import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EpMateEntryPage } from './ep-mate-entry';

@NgModule({
  declarations: [
    EpMateEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(EpMateEntryPage),
  ],
})
export class EpMateEntryPageModule {}
