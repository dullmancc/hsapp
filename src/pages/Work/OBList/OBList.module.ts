import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObListPage } from './OBList';

@NgModule({
  declarations: [
    ObListPage,
  ],
  imports: [
    IonicPageModule.forChild(ObListPage),
  ],
})
export class ObListPageModule {}
