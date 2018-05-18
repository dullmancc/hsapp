import {Component, ComponentRef, EventEmitter, Output} from '@angular/core';
import {EpMateinfoSelectPage} from "../../pages/Work/ep-mate-entry/ep-mateinfo-select/ep-mateinfo-select";
import {EPMaterialModel} from "../../Model/EPMateInfoForEntry";
import {NavController} from "ionic-angular";

/**
 * Generated class for the AddMateComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'add-mate',
  templateUrl: 'add-mate.html'
})
export class AddMateComponent {
  componentRef;
  index:number;
  ePInfo;
  MaterModel:EPMaterialModel = new EPMaterialModel();
  ePMateInfoForEntry;
  materialInfo;
  @Output() change: EventEmitter<number> = new EventEmitter<number>();
  constructor(public navCtrl: NavController) {
    console.log('Hello AddMateComponent Component'+this.index);
    //this.text = 'Hello World';
  }
  deleteComp(){
    this.componentRef[this.index].destroy();
    this.componentRef.splice(this.index,1);
    this.ePMateInfoForEntry.splice(this.index+1,1);
    for(var s = 0;s<this.componentRef.length;s++){
      this.componentRef[s].instance.index = s;
    }
  }
  GetMateName(){
    if(this.materialInfo.MaterialInfoID==''){
      alert('请选择材料信息');
      return;
    }
    let data = {
      'materialInfos':this.materialInfo.EPMaterialModels,
      'type':3,
      'MaterialInfoID':this.materialInfo.MaterialInfoID,
      callback: data =>{
        this.MaterModel = data;
        this.ePMateInfoForEntry[0].EPMaterialModelID = this.MaterModel.EPMaterialModelID;
      }
    };
    this.navCtrl.push(EpMateinfoSelectPage,data);
    //this.navCtrl.push(EpMateinfoSelectPage,{'materialInfos':this.materialUnits.materialUnits,'type':i});
  }

}
