import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NormalPzPage} from "../../../JianLiPZ/normal-pz/normal-pz";
import {InspectionPage} from "../inspection/inspection";

/**
 * Generated class for the AccepetanceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inspection-list',
  templateUrl: 'inspection-list.html',
})
export class InspectionListPage {
  EmployeeID;
  EprojectID;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public load(){

  }

  public newInspection(){
    this.navCtrl.push(InspectionPage,{'EmployeeID':this.EmployeeID,'EProjectID':this.EprojectID});
  }

  goBack(){
    this.navCtrl.pop();
  }

}
