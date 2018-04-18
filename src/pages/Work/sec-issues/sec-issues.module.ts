import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecIssuesPage } from './sec-issues';
import { SuperTabsModule } from 'ionic2-super-tabs';
@NgModule({
  declarations: [
    SecIssuesPage,
  ],
  imports: [
    IonicPageModule.forChild(SecIssuesPage),
    SuperTabsModule.forRoot(),
  ],
})
export class SecIssuesPageModule {}
