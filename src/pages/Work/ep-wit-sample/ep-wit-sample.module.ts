import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EpWitSamplePage } from './ep-wit-sample';

@NgModule({
  declarations: [
    EpWitSamplePage,
  ],
  imports: [
    IonicPageModule.forChild(EpWitSamplePage),
  ],
})
export class EpWitSamplePageModule {}
