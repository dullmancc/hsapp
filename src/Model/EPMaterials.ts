import {Injectable} from '@angular/core';

@Injectable()
export class EPMaterials{
  public  EPCSID ;
  public  EntryDate ;
  public  EPMateEntryTypeID ;
  public  UsePlace ;
  public  EPEntryResultID ;
  public  MaterialInfo
  public  ECUnitID ;
  public  Details ;
  public  State ;
  public  EPCheckID;
  public  Employee_EmployeeID;
  public  EPCSParent;
  public Employee;

  public constructor(ECUnitID,EmployeeID,EPCheckID){
    this.EPCSID = '';
    this.EntryDate = '2000-01-01T00:00:00Z';
    this.EPMateEntryTypeID = '';
    this.UsePlace = '';
    this.EPEntryResultID = '';
    this.MaterialInfo = '';
    this.ECUnitID = ECUnitID;
    this.Details = '';
    this.EPCheckID = EPCheckID;
    this.Employee_EmployeeID = EmployeeID;
  }
}
export class EPMateEntryType
{
  public EPMateEntryTypeID;
  public Desc ;
  constructor (){
    this.EPMateEntryTypeID = '';
    this.Desc = '';
  }
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
