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
import {EPEntryResult} from "../../../../Model/EPMaterials";
import {QualityGJService} from "../../../../providers/GangJinQualityService";

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
  public ePEntryResult:EPEntryResult[];
  callback;
  EPCSID;
  leavetype:boolean = false;

  qualityGJService=[];
  public MateStandard;

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
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private resolver:ComponentFactoryResolver,
              public http:HttpService) {
    this.callback = this.navParams.get('callback');
    this.EPCSID = this.navParams.get('EPCSID');
    this.ePMateInfoForEntry = this.navParams.get('ePMateInfoForEntry');
    this.curMaterialInfo = this.navParams.get('curMateInfo');
    console.log(this.ePMateInfoForEntry);
    console.log(this.curMaterialInfo)

    if(this.ePMateInfoForEntry.length==0){
      this.MaterModel = new EPMaterialModel();
      this.qualityGJService.push(true);
      this.ePMateInfoForEntry.push(this.ePInfo);
    }else {

      this.curMaterialInfo.MaterialBrands.forEach(v=>{
        if(v.MaterialBrandID==this.ePMateInfoForEntry[0].MaterialBrandID){
          this.curMaterialBrand = v;
        }
      });
      if(typeof this.ePMateInfoForEntry[0].MaterialUnit !== 'undefined'){
        this.curMaterialUnits = this.ePMateInfoForEntry[0].MaterialUnit;
      }
    }

    this.http.get(ApiUrl+'EPMateEntries/GetMateType').subscribe(res=>{
      this.ePEntryResult = res.ePEntryResults;
      console.log(res);
      this.ePMateInfoForEntry.forEach(v=>{
          for(let s=0 ;s< this.ePEntryResult.length;s++){
            if(this.ePEntryResult[s].EPEntryResultID==v.EPEntryResultID){
              v.EPEntryResult = this.ePEntryResult[s];
            }
          }
        });
    },error=>{
      alert(error.toString());
    });

    this.http.get(ApiUrl+'MaterialInfoes/GetMaterialInfoes').subscribe(res=>{
      this.materialInfo = res.materialInfos;
      this.materialUnits = res.materialUnits;

     },error=>{
      console.log(error);
    });

    this.http.get('')
  }

  ionViewWillEnter() {
    this.http.get(ApiUrl+'MaterialInfoes/GetMaterialInfoes').subscribe(res=>{
      this.materialInfo = res.materialInfos;
      this.materialUnits = res.materialUnits;
      if(this.ePMateInfoForEntry.length!=0){

      }
    },error=>{
      console.log(error);
    });

    console.log('ionViewDidLoad EpAddMatePage');
  }

  compare1Fn(e1:EPEntryResult, e2: EPEntryResult): boolean {
    return e1 && e2 ? e1.EPEntryResultID === e2.EPEntryResultID : e1 === e2;
  }


  creatComponent(){
    let ePInf:EPMateInfoForEntry = new EPMateInfoForEntry();
    ePInf.EPMaterialModelID ='';
    this.ePMateInfoForEntry.push(ePInf);
    this.qualityGJService.push(true);
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
    if(this.ePMateInfoForEntry[index].EPMaterialModelID!=''){
      this.http.post(ApiUrl+'EPMateInfoForEntries/DeleteEPMateInfoForEntry',{'id':this.ePMateInfoForEntry[index].EPMateInfoForEntryID}).subscribe(res=>{
        console.log(res);
      },error=>{
        console.log(error);
      });
    }
    this.ePMateInfoForEntry.splice(index,1);
    this.qualityGJService.splice(index,1);
  }

  DimaterChang(){

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
                    this.curMaterialInfo = data.data;
                    if(data.new==1){
                      this.materialInfo.push(data.data);
                    }
                    console.log(data);
                };
                this.navCtrl.push(EpMateinfoSelectPage,data);
                break;
      case 1:   if(this.curMaterialInfo.MaterialInfoID==''){
                  alert('请选择材料信息');
                  return;
                }
                data.callback = data=>{
                  this.curMaterialBrand = data.data;
                  if(data.new==1){
                    this.materialInfo.forEach(V=>{
                      if(V.MaterialInfoID==this.curMaterialInfo.MaterialInfoID){
                        V. MaterialBrands.push(data.data);
                      }
                    });
                    this.curMaterialInfo.MaterialBrands.push(data.data);
                  }
                  console.log(data);
                };
                data.materialInfos = this.curMaterialInfo.MaterialBrands;
                this.navCtrl.push(EpMateinfoSelectPage,data);
                break;
      case 2:
                data.callback = data=>{
                  this.curMaterialUnits = data.data;
                  if(data.new==1){
                    this.materialUnits.push(data.data);
                  }
                  console.log(data);
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
                  if(data.new==1){
                  this.materialInfo.forEach(V=>{
                    if(V.MaterialInfoID==this.curMaterialInfo.MaterialInfoID){
                      V. EPMaterialModels.push(data.data);
                    }
                  });
                  this.curMaterialInfo.EPMaterialModels.push(data.data);
                  }


                  console.log(data);
              }
              data.materialInfos = this.curMaterialInfo.EPMaterialModels;
              this.navCtrl.push(EpMateinfoSelectPage,data);
                break;
      default:break;
    }
      //this.navCtrl.push(EpMateinfoSelectPage,{'materialInfos':this.materialInfo,'type':i})
  }

  SelectFinish(){
    if(this.curMaterialInfo.MaterialInfoID==""||this.curMaterialBrand.MaterialBrandID==""||this.curMaterialUnits.MaterialUnitID==""){
      alert('请填完信息！');
      return;
    }

    for(var s = 0;s<this.ePMateInfoForEntry.length;s++){
      this.ePMateInfoForEntry[s].EPMateEntryID = this.EPCSID;
      this.ePMateInfoForEntry[s].MaterialUnitID = this.curMaterialUnits.MaterialUnitID;
      this.ePMateInfoForEntry[s].MaterialBrandID = this.curMaterialBrand.MaterialBrandID;
      this.ePMateInfoForEntry[s].MaterialInfoID = this.curMaterialInfo.MaterialInfoID;
      this.ePMateInfoForEntry[s].EPMateInfoForEntryID = '';
      this.ePMateInfoForEntry[s].EPEntryResultID = this.ePMateInfoForEntry[s].EPEntryResult.EPEntryResultID;
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

    this.leavetype = true;
    this.navCtrl.pop();
  }

  ionViewWillLeave(){

  }
  goBack(){

    if(this.curMaterialInfo.MaterialInfoID==""){
      this.ePMateInfoForEntry =[];
    }

    let data ={
      'MaterialInfoName':this.curMaterialInfo,
      'Record':this.ePMateInfoForEntry,
    }

    this.callback(data);
    this.leavetype = false;
    this.navCtrl.pop();
  }
}
