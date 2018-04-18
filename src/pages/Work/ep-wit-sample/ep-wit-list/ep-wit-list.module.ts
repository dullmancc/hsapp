import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EpWitListPage } from './ep-wit-list';

@NgModule({
  declarations: [
    EpWitListPage,
  ],
  imports: [
    IonicPageModule.forChild(EpWitListPage),
  ],
})
export class EpWitListPageModule {}
