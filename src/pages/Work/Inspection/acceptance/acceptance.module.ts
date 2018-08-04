import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcceptancePage } from './acceptance';

@NgModule({
  declarations: [
    AcceptancePage,
  ],
  imports: [
    IonicPageModule.forChild(AcceptancePage),
  ],
})
export class AcceptancePageModule {}
