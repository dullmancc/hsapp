import {Injectable} from '@angular/core';

@Injectable()
export class EPSecIssue {
  public EPCSID;
  public Employee_EmployeeID;
  public TrackEmployeeID;
  public HandleEmployee;
  public EProject_EProjectID;
  public UnitPart;
  public Details;
  public EPSecIssueTime;
  public Deadline;
  public State;
  public secState;
  public EPNoticeListstate;
  public ModifyRequirement;
  public EPSecRiskID;
  public EPSecProblemID;
  public EPCSParent;
  public constructor(Employee_EmployeeID:string,EProject_EProjectID:string){
    this.EPCSID = '';
    this.EProject_EProjectID = EProject_EProjectID;
    this.Employee_EmployeeID = Employee_EmployeeID;
    this.TrackEmployeeID = '';
    this.HandleEmployee = '';
    this.secState = 0;
    this.EPNoticeListstate = 0;
    this.ModifyRequirement = '';
    this.UnitPart = '';
    this.Details = '';
    this.EPSecIssueTime= '2000-01-01T00:00:00Z';
    this.Deadline = '2000-01-01T00:00:00Z';
    this.State = 0;
    this.EPSecRiskID = '';
    this.EPSecProblemID = '';
  }
}
export class EPSecRisk{
  public EPSecRiskID;
  public Desc;
  public constructor(){
    this.EPSecRiskID = '';
    this.Desc ='';
  }
}
export class EPSecProblem{
  public EPSecProblemID;
  public Desc;
  public constructor(){
    this.EPSecProblemID = '';
    this.Desc ='';
  }
}
