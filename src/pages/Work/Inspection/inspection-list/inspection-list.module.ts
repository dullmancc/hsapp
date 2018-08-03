import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionListPage } from './inspection-list';

@NgModule({
  declarations: [
    InspectionListPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionListPage),
  ],
})
export class InspectionListPageModule {}
