import {Injectable} from '@angular/core';

@Injectable()
export class EPCSParent{
  public  EPCSID ;
  public  EProjectID ;
  public  EmployeeID ;

  public EPCSFiles;
  public constructor(){
    this.EPCSID ='';
    this.EmployeeID = '';
    this.EProjectID= '';
    this.EPCSFiles = [];
  }
}
