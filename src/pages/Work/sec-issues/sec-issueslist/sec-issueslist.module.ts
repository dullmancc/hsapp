import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecIssueslistPage } from './sec-issueslist';

@NgModule({
  declarations: [
    SecIssueslistPage,
  ],
  imports: [
    IonicPageModule.forChild(SecIssueslistPage),
  ],
})
export class SecIssueslistPageModule {}
