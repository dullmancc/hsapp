import {Injectable} from '@angular/core';

export class AcceptanceMisc{
  Acceptance:any;
  AcceptanceRecord:AcceptanceRecord;
}

export class AcceptanceRecord{
  AcceptanceID:number;
  InspectionID:string;
  MinSampleNum:number;
  RealSampleNum:number;
  CheckRecord:string;
  CheckResult;

  public AcceptanceRecord(){
    this.AcceptanceID = -1;
    this.InspectionID = "";
    this.MinSampleNum = 0;
    this.RealSampleNum = 0;
    this.CheckRecord = "";
    this.CheckResult = 1;
  }
}

export class Inspection{
  InspectionID:string;
  ECUnitReportInspectionID:string;
  InspectionTypeID;
  DivEngineeringID;
  SubDiveEngineeringID;
  SubEngineeringID;
  EProject;
  RecorderID;
  ECUnitEmployeeID;
  State;
  AcceptanceRecords:AcceptanceRecord[];

  public Inspection(){
    this.InspectionID="";
    this.ECUnitReportInspectionID="";
    this.InspectionTypeID=0;
    this.DivEngineeringID=0;
    this.SubDiveEngineeringID=0;
    this.SubEngineeringID=0;
    this.EProject=0;
    this.RecorderID=0;
    this.ECUnitEmployeeID=0;
    this.State=-1;
    this.AcceptanceRecords=[];
  }
}
