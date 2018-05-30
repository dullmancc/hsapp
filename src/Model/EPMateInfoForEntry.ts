import {Injectable} from '@angular/core';
import {EPEntryResult} from "./EPMaterials";

@Injectable()
export class EPMateInfoForEntry{
  public EPMateInfoForEntryID;
  public EPMateEntryID;
  public MaterialInfoID;
  public MaterialBrandID;
  public EPMaterialModelID;
  public MaterialUnitID;
  public EPMaterialNums;
  public EPEntryResultID ;
  public EPEntryResult:EPEntryResult;
  public MaterialUnit;

  public EPMaterialModel:EPMaterialModel;
  constructor(){
  this.EPMateInfoForEntryID='';
  this.EPMateEntryID='';
  this.EPEntryResultID='' ;
  this.MaterialInfoID='';
  this.MaterialBrandID='';
  this.EPMaterialModelID='';
  this.MaterialUnitID='';
  this.EPMaterialNums='';
  this.EPMaterialModel = new EPMaterialModel();
  }
}

export class MaterialUnit
{
  public MaterialUnitID;
  public UnitName;
  constructor(){
    this.MaterialUnitID='';
    this.UnitName = '请选择单位';
  }
}
export class MaterialBrand
{
  public MaterialBrandID;
  public BrandName ;
  public constructor(){
    this.MaterialBrandID = '';
    this.BrandName = '请选择品牌';
  }
}
export class EPMaterialModel {
  public EPMaterialModelID;
  public Desc;
  public constructor(){
    this.EPMaterialModelID='';
    this.Desc = '请选择型号';
  }
}

//材料种类
export class MaterialInfo
{
  public MaterialInfoID ;
  public MaterialInfoName ;

  public  EPMaterialModels:EPMaterialModel[];
  public  MaterialBrands:MaterialBrand[] ;
  public constructor(){
    this.MaterialInfoID = '';
    this.MaterialInfoName= '请选择材料';
  }
}

