import {Injectable} from '@angular/core';

@Injectable()
export class EPWitnSample{
  public EPCSID ;
  public RecordTime ;
  public Details;
  public State ;
  public ECUnitID ;
  public EPCheckID ;
  public Employee_EmployeeID ;
  public EPCSParent;
  public Employee;

  public constructor(){
    this.EPCSID = '';
    this.RecordTime =  '2000-01-01T00:00:00Z';
    this.Details ='';
    this.State = 0;
    this.ECUnitID = '';
    this.Employee_EmployeeID = '';
  }

}
