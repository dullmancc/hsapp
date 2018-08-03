import {Injectable} from '@angular/core';
import {EPCSParent} from "./EPCSParent";
import {PZBelong} from "./EPPZBelong";
import {PZCheckRecord} from "./PZConcreteSlumpRecord";

@Injectable()
export class Pangzhan{

  public EmployeeTransferID;
  public ConstructionCase;
  public SupervisorCase;
  public FindPromble;
  public Suggestion;
  public PZBelongId;
  public EPCSID;
  public ConstructionNums;
  public CheckNums;
  public EPZState;//1:已完成 0：已交班
  public State;
  public PZRoot;
  public BeginTime;
  public EndTime;

  public EPCSParent:EPCSParent;
  public PZBelong:PZBelong;
  public PZCheckRecords:PZCheckRecord[] = [];

  constructor(){
  var datetime = new Date();

  this.EPCSID = '';
  this.EmployeeTransferID = '';
  this.ConstructionNums = '';
  this.CheckNums = '';
  this.EPZState = 0;

  this.BeginTime = datetime.getFullYear()+'/'+datetime.getMonth()+'/'+datetime.getDay()+' '+datetime.getHours()+':'+datetime.getMinutes();
  this.EndTime = datetime.getFullYear()+'/'+datetime.getMonth()+'/'+datetime.getDay()+' '+datetime.getHours()+':'+datetime.getMinutes();
  this.ConstructionCase = '';
  this.SupervisorCase = '';
  this.FindPromble = '';
  this.Suggestion = '';

  this.State = 0;
  this.PZBelongId = '';

  this.PZBelong = new PZBelong();
  this.EPCSParent = new EPCSParent();
  }
}
