import {Injectable} from '@angular/core';

export class AcceptanceMisc{
  Acceptance:any;
  AcceptanceRecord:AcceptanceRecord;
}

export class AcceptanceRecord{
  public AcceptanceID;
  public InspectionID;
  public MinSampleNum;
  public RealSampleNum;
  public CheckRecord;
  public CheckResult;
  public IsConfirmed;

  public AcceptanceRecord(){
    this.AcceptanceID = -1;
    this.InspectionID = "";
    this.MinSampleNum = 0;
    this.RealSampleNum = 0;
    this.CheckRecord = "";
    this.CheckResult = 1;
    this.IsConfirmed=false;
  }
}

@Injectable()
export class Inspection{
  public InspectionID:string;
  public ECUnitReportInspectionID:string;
  public InspectionTypeID;
  public DivEngineeringID;
  public SubDivEngineeringID;
  public SubEngineeringID;
  public EProjectID;
  public RecorderID;
  public ECUnitEmployeeID;
  public State;
  public AcceptanceRecords:AcceptanceRecord[]=[];

  public Inspection(){
    this.InspectionID="";
    this.ECUnitReportInspectionID="";
    this.InspectionTypeID=0;
    this.DivEngineeringID=0;
    this.SubDivEngineeringID=0;
    this.SubEngineeringID=0;
    this.EProjectID='';
    this.RecorderID='';
    this.ECUnitEmployeeID=0;
    this.State=-1;
  }
}
