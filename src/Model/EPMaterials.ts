import {Injectable} from '@angular/core';

@Injectable()
export class EPMaterials{
  public  EPCSID ;
  public  EntryDate ;
  public  entryType:EPMateEntryType ;
  public  UsePlace ;
  public  ECUnitID ;
  public  Details ;
  public  State ;
  public  EPCheckID;
  public  Employee_EmployeeID;
  public  EPCSParent;
  public Employee;
  public EPMateInfoForEntries;
  public EProject_EProjectID;

  public constructor(ECUnitID,EmployeeID,EPCheckID,EProjectID){
    this.EPCSID = '';
    this.EntryDate = '2000-01-01T00:00:00Z';
    this.entryType = 0;
    this.UsePlace = '';
    this.ECUnitID = ECUnitID;
    this.Details = '';
    this.EProject_EProjectID = EProjectID;
    this.EPCheckID = EPCheckID;
    this.Employee_EmployeeID = EmployeeID;
  }
}
export enum EPMateEntryType
{
  材料进场,设备进场
}
export class EPEntryResult
{
  public EPEntryResultID;
  public Desc ;
  constructor (){
    this.EPEntryResultID = '';
    this.Desc = '';
  }
}
