import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecIssuesPage } from './sec-issues';
import { SuperTabsModule } from 'ionic2-super-tabs';
import {SecIssRecordPage} from "./sec-iss-record/sec-iss-record";
import {SecIssueslistPage} from "./sec-issueslist/sec-issueslist";
import {MyApp} from "../../../app/app.component";
@NgModule({
  declarations: [
    SecIssuesPage,
    SecIssRecordPage,
    SecIssueslistPage,
  ],
  imports: [
    IonicPageModule.forChild(SecIssuesPage),
    SuperTabsModule.forRoot(),
  ],
  entryComponents: [
    SecIssRecordPage,
    SecIssueslistPage,
  ],
})
export class SecIssuesPageModule {}
