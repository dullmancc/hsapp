import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {  Platform, ViewController } from 'ionic-angular';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html'
})
export class ProjectPage {
  public pro;
  public ProcessW;

  constructor(public navCtrl: NavController,
              public platform: Platform,
              public params: NavParams,
              public viewCtrl: ViewController) {
    this.pro = this.params.get('charNum');
    this.ProcessW = this.pro.EPState * 10 + '%';
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  goBack(){
    this.navCtrl.pop();
  }
}
