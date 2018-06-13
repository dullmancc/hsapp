import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PzSelectPeoplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pz-select-people',
  templateUrl: 'pz-select-people.html',
})
export class PzSelectPeoplePage {

  employees;
  curemployee;
  callback;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.employees = this.navParams.get('employees');
     this.callback = this.navParams.get('callback');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PzSelectPeoplePage');
  }
  goBack(){
    this.navCtrl.pop();
  }

  save(){
    var employee;
    this.employees.forEach(v=>{
      if(v.EmployeeID==this.curemployee){
        employee = v;
      }
    });

    this.callback(employee);
    this.navCtrl.pop();
  }
}
