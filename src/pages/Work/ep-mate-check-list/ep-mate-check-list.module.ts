import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EpMateCheckListPage } from './ep-mate-check-list';

@NgModule({
  declarations: [
    EpMateCheckListPage,
  ],
  imports: [
    IonicPageModule.forChild(EpMateCheckListPage),
  ],
})
export class EpMateCheckListPageModule {}
