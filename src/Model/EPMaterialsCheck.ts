import {Injectable} from '@angular/core';

@Injectable()
export class  EPMaterialsCheck{
    public  EPCheckID;
    public  EPCheckName;
    public  EProjectID;
    public  EntryDate;
    public  ECUnitName;
    public  ECUnit;
    public constructor(EPCheckID,EPCheckName,EProjectID,EntryDate,ECUnitName,ECUnit){
      this.EPCheckID = EPCheckID;
      this.EPCheckName = EPCheckName;
      this.EntryDate= EntryDate;
      this.EProjectID = EProjectID;
      this.ECUnitName =ECUnitName;
      this.ECUnit = ECUnit;
    }
}
