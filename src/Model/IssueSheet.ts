import {Injectable} from '@angular/core';

@Injectable()
export class IssueSheet {
  public IssueSheetID;
  public EProjectID;
  public IssueName;
  public IssueTypeID;
  public Position;
  public Stage;
  public Level;
  public Desc;
  public RIUnitID;
  public RIPersonID;
  public ReqTime;
  public RealTime;
  public RIResult;
  public RecorderID;
  public TracerID;
  public Command;
  public CommState;
  public  ReviewTime
  public  RecordTime;
  public State;
  public IssueFile;

  public constructor(IssueSheetID=0,IssueName="",IssueTypeID=0,Position="",Stage=0,Level=0,Desc="",RIUnitID="",RIPersonID="",ReqTime="",RealTime="",RIResult=0,RecorderID="",RecordTime="",TracerID="",ReviewTime="",Command=0,CommState=0, State=0) {
    this.IssueSheetID=IssueSheetID;
    this.IssueName=IssueName;
    this.IssueTypeID=IssueTypeID;
    this.Position=Position;
    this.Stage=Stage;
    this.Level=Level;
    this.Desc=Desc;
    this.RIUnitID=RIUnitID;
    this.RIPersonID=RIPersonID;
    this.ReqTime=ReqTime;
    this.RealTime=RealTime;
    this.RIResult=RIResult;
    this.RecorderID=RecorderID;
    this.RecordTime=RecordTime
    this.TracerID=TracerID;
    this.ReviewTime=ReviewTime;
    this.Command=Command;
    this.CommState=CommState;
    this.State=State;
  }
}
