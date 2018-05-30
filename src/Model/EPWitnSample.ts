import {Injectable} from '@angular/core';

@Injectable()
export class EPWitnSample{
  public EPMateInfoForEntryID ;
  public RecordTime ;
  public Details;
  public State ;
  public ReportID ;
  public ReviewNums ;
  public EmployeeID ;

  public constructor(){
    this.EPMateInfoForEntryID = '';
    this.RecordTime =  '2000-01-01T00:00:00Z';
    this.Details ='';
    this.State = 0;
    this.ReportID = '';
    this.ReviewNums = '';
    this.EmployeeID = '';
  }

}
