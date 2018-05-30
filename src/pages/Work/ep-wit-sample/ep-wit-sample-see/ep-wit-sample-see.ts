import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiUrl} from "../../../../providers/Constants";
import {Photo} from "../../../../providers/ChoosePhotoService";
import {EPWitnSample} from "../../../../Model/EPWitnSample";

/**
 * Generated class for the EpWitSampleSeePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-wit-sample-see',
  templateUrl: 'ep-wit-sample-see.html',
})
export class EpWitSampleSeePage {

  public EPMaterials;
  ResultDesc;
  public photoes:Photo[][]=[];
  public ePWitRecord:any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.EPMaterials = this.navParams.get('EPMaterials');

    this.EPMaterials.forEach(V=>{
      if(V.EPEntryResultID=="EPMR03"){
        V.EPWitnSample.ReportID = '';
        this.ePWitRecord.push(V.EPWitnSample);
      }
    });

    for(let j = 0;j<this.ePWitRecord.length;j++){
      let ePfiles = this.ePWitRecord[j].EPCSParent.EPCSFiles;
      for (let i = 0; i < ePfiles.length; i++) {
        var p = new Photo();
        var tupian = ePfiles[i].FileName.substr(ePfiles[i].FileName.lastIndexOf('.'));
        if (tupian == '.png' || tupian == '.jpg' || tupian == '.gif' || tupian == '.tiff' || tupian == '.svg') {
          p.src = ApiUrl.slice(0, ApiUrl.length - 4) + ePfiles[i].FilePath.substring(2);
          p.isPhoto = true;
        } else {
          p.src = ePfiles[i].FileName;
          p.isPhoto = false;
        }
        this.photoes[j].push(p);
        this.photoes[j][i].ePfile = ePfiles[i];
      }
    }
  }
  GetState(item)
  {
    switch (item){
      case 0: return '抽样中';
      case 1: return '送审中';
      case 2: return '复审中';
      case 3: return '合格';
      case 4: return '不合格';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpWitSampleSeePage');
  }


  goBack(){
    this.navCtrl.pop();
  }
}
