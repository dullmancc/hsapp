import {
  Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentFactory,
  ComponentRef, OnDestroy
} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AddMateComponent} from "../../../../components/add-mate/add-mate";
import {HttpService} from "../../../Service/HttpService";
import {ApiUrl} from "../../../../providers/Constants";
import {EpMateinfoSelectPage} from "../ep-mateinfo-select/ep-mateinfo-select";
import {
  EPMateInfoForEntry, EPMaterialModel, MaterialBrand, MaterialInfo,
  MaterialUnit
} from "../../../../Model/EPMateInfoForEntry";

/**
 * Generated class for the EpAddMatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ep-add-mate',
  templateUrl: 'ep-add-mate.html',
})
export class EpAddMatePage implements OnDestroy{
  materialInfo;
  materialUnits;
  callback;
  EPCSID;
  curMaterialBrand:MaterialBrand = new MaterialBrand();
  curMaterialUnits:MaterialUnit = new MaterialUnit();
  curMaterialInfo :MaterialInfo = new MaterialInfo();
  MaterModel:EPMaterialModel;
  ePInfo:EPMateInfoForEntry = new EPMateInfoForEntry();
  ePMateInfoForEntry:EPMateInfoForEntry[]=[];
  ngOnDestroy(): void {
    for(var s = 0;s<this.componentRef.length;s++){
      this.componentRef[s].destroy();
    }
  }
  componentRef: ComponentRef<AddMateComponent>[] =[];
  @ViewChild("addContainer",{read:ViewContainerRef}) container:ViewContainerRef;
  constructor(public navCtrl: NavController, public navParams: NavParams,private resolver:ComponentFactoryResolver,public http:HttpService) {
    this.callback = this.navParams.get('callback');
    this.EPCSID = this.navParams.get('EPCSID');
    this.ePMateInfoForEntry = this.navParams.get('ePMateInfoForEntry');
    this.curMaterialInfo = this.navParams.get('curMateInfo');

    if(this.ePMateInfoForEntry.length==0){
      this.MaterModel = new EPMaterialModel();
      this.ePMateInfoForEntry.push(this.ePInfo);
    }else {
      this.curMaterialInfo.MaterialBrands.forEach(v=>{
        if(v.MaterialBrandID==this.ePMateInfoForEntry[0].MaterialBrandID){
          this.curMaterialBrand = v;
        }
      });
    }

    this.http.get(ApiUrl+'MaterialInfoes/GetMaterialInfoes').subscribe(res=>{
      this.materialInfo = res.materialInfos;
      this.materialUnits = res.materialUnits;
    },error=>{
      console.log(error);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpAddMatePage');
  }


  creatComponent(){
    let ePInf:EPMateInfoForEntry = new EPMateInfoForEntry();
    ePInf.EPMaterialModelID ='';
    this.ePMateInfoForEntry.push(ePInf);
  }
  /*
  creatComponent(){
      let ePInf:EPMateInfoForEntry = new EPMateInfoForEntry();
      ePInf.EPMaterialModelID ='';
      this.ePMateInfoForEntry.push(ePInf);
      let factory:ComponentFactory<AddMateComponent>  = this.resolver.resolveComponentFactory(AddMateComponent);
      this.componentRef.push(this.container.createComponent(factory));
      this.componentRef[this.componentRef.length-1].instance.index = this.componentRef.length-1;
      this.componentRef[this.componentRef.length-1].instance.componentRef = this.componentRef;
      this.componentRef[this.componentRef.length-1].instance.ePInfo = this.ePMateInfoForEntry[this.componentRef.length];
      this.componentRef[this.componentRef.length-1].instance.ePMateInfoForEntry = this.ePMateInfoForEntry;
      this.componentRef[this.componentRef.length-1].instance.materialInfo = this.curMaterialInfo;
  }*/
  deleteComponent(index){
    this.ePMateInfoForEntry.splice(index,1);
    if(this.ePMateInfoForEntry[index].EPMaterialModelID!=''){
      this.http.post(ApiUrl+'EPMateInfoForEntries/DeleteEPMateInfoForEntry',{'id':this.ePMateInfoForEntry[index].EPMateInfoForEntryID}).subscribe(res=>{
        console.log(res);
      },error=>{
        console.log(error);
      });
    }
  }

  GetMateName(i,index){
    let data = {
      'materialInfos':this.materialInfo,
      'type':i,
      'MaterialInfoID':this.curMaterialInfo.MaterialInfoID,
      callback: data => {
        console.log(data);
      }
    };
    switch (i){
      case 0:   data.callback = data=>{
                    this.curMaterialInfo = data;
                };
                this.navCtrl.push(EpMateinfoSelectPage,data);
                break;
      case 1:   if(this.curMaterialInfo.MaterialInfoID==''){
                  alert('请选择材料信息');
                  return;
                }
                data.callback = data=>{
                  this.curMaterialBrand = data;
                };
                data.materialInfos = this.curMaterialInfo.MaterialBrands;
                this.navCtrl.push(EpMateinfoSelectPage,data);
                break;
      case 2:
                data.callback = data=>{
                  this.curMaterialUnits = data;
                };
                data.materialInfos = this.materialUnits;
                this.navCtrl.push(EpMateinfoSelectPage,data);
                break;
      case 3:  if(this.curMaterialInfo.MaterialInfoID==''){
                alert('请选择材料信息');
                return;
              }
              data.callback = data=>{
                  this.ePMateInfoForEntry[index].EPMaterialModel = data;
              }
              data.materialInfos = this.curMaterialInfo.EPMaterialModels;
              this.navCtrl.push(EpMateinfoSelectPage,data);
                break;
      default:break;
    }
      //this.navCtrl.push(EpMateinfoSelectPage,{'materialInfos':this.materialInfo,'type':i})
  }

  SelectFinish(){
    if(this.curMaterialInfo.MaterialInfoID==''||this.curMaterialBrand.MaterialBrandID==''||this.curMaterialUnits.MaterialUnitID==''){
      alert('请填完信息！');
      return;
    }

    for(var s = 0;s<this.ePMateInfoForEntry.length;s++){
      this.ePMateInfoForEntry[s].EPCSID = this.EPCSID;
      this.ePMateInfoForEntry[s].MaterialUnitID = this.curMaterialUnits.MaterialUnitID;
      this.ePMateInfoForEntry[s].MaterialBrandID = this.curMaterialBrand.MaterialBrandID;
      this.ePMateInfoForEntry[s].MaterialInfoID = this.curMaterialInfo.MaterialInfoID;
      this.ePMateInfoForEntry[s].EPMateInfoForEntryID = '';
      this.ePMateInfoForEntry[s].EPMaterialModelID = this.ePMateInfoForEntry[s].EPMaterialModel.EPMaterialModelID;
      if(this.ePMateInfoForEntry[s].EPMaterialModelID == ''){
        alert('请填完信息！');
        return;
      }
    }

    let data ={
      'MaterialInfoName':this.curMaterialInfo,
      'Record':this.ePMateInfoForEntry,
    }

    this.callback(data);
    this.navCtrl.pop();
  }

  goBack(){
    let data ={
      'MaterialInfoName':this.curMaterialInfo,
      'Record':this.ePMateInfoForEntry,
    }

    this.callback(data);
    this.navCtrl.pop();
  }

}
