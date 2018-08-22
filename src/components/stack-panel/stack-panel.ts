import {Component, Input} from '@angular/core';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import {ProjectPage} from "../../pages/Project/project";
import {JLProjectPage} from "../../pages/JianLiPZ/JLProject";
import {TabsPage} from "../../pages/tabs/tabs";
import {InspectionListPage} from "../../pages/Work/Inspection/inspection-list/inspection-list";
import {EpMateCheckListPage} from "../../pages/Work/ep-mate-check-list/ep-mate-check-list";
import {SecIssuesPage} from "../../pages/Work/sec-issues/sec-issues";
import {NavController, NavParams} from "ionic-angular";
import {Project} from "../../pages/Work/ep-mate-entry/list/list";
import {SecRiskRecordPage} from "../../pages/Work/sec-issues/sec-risk-record/sec-risk-record";

/**
 * Generated class for the StackPanelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'stack-panel',
  templateUrl: 'stack-panel.html'
})
export class StackPanelComponent {
  @Input()
  CurProject:Project;


  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  GoWork(i){
    switch (i){
      case 0:
        this.navCtrl.push(ProjectPage,{'charNum':this.CurProject});
        break;
      case 1:
        this.navCtrl.push(JLProjectPage,{'charNum':this.CurProject.EProjectID,'userId':TabsPage.UserInfo.employees.EmployeeID});
        break;
      case 2:
        this.navCtrl.push(InspectionListPage,{'EProjectID':this.CurProject.EProjectID,'userId':TabsPage.UserInfo.employees.EmployeeID});
        break;
      case 3:
        this.navCtrl.push(EpMateCheckListPage,{'EProjectID':this.CurProject.EProjectID,'userId':TabsPage.UserInfo.employees.EmployeeID});
        break;
      case 4:
        this.navCtrl.push(SecIssuesPage,{'EProject':this.CurProject,'userId':TabsPage.UserInfo.employees.EmployeeID});
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      default:
        break;

    }
  }
}
