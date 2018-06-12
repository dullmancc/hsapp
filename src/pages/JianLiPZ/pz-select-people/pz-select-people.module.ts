import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PzSelectPeoplePage } from './pz-select-people';

@NgModule({
  declarations: [
    PzSelectPeoplePage,
  ],
  imports: [
    IonicPageModule.forChild(PzSelectPeoplePage),
  ],
})
export class PzSelectPeoplePageModule {}
