import {Injectable} from '@angular/core';

@Injectable()
export class ECUnit{
  public  ECUnitID ;
  public  Name ;
  public  PhoneNumber ;
  public  Role ;
  constructor(ECUnitID="",Name="请选择",PhoneNumber="",Role=""){
    this.ECUnitID=ECUnitID;
    this.Name=Name;
    this.PhoneNumber=PhoneNumber;
    this.Role=Role;
  }
}
