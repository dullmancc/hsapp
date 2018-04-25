import {Injectable} from '@angular/core';

@Injectable()
export class PzRecord{
  public PangzhanId;
  public Employee_EmployeeID;
  public Process;
  public Part;
  public ConStructUnit;
  public BeginTime;
  public SchBeginTime;
  public EndTime;
  public SchEndTime;
  public ConstructionCase;
  public SupervisorCase;
  public FindPromble;
  public Suggestion;
  public Remark;
  public State;
  public PZBelongId;
  public EPCSParent;

  constructor(){
  this.PangzhanId = '';
  this.Employee_EmployeeID = '';
  this.Process = '';
  this.Part = '';
  this.ConStructUnit = '';
  this.BeginTime = '2000-01-01T00:00:00Z';
  this.SchBeginTime = '2000-01-01T00:00:00Z';
  this.EndTime = '2000-01-01T00:00:00Z';
  this.SchEndTime = '2000-01-01T00:00:00Z';
  this.ConstructionCase = '';
  this.SupervisorCase = '';
  this.FindPromble = '';
  this.Suggestion = '';
  this.Remark = '';
  this.State = 0;
  this.PZBelongId = '';
  }
}
