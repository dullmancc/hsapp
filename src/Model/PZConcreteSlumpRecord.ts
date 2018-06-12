import {Injectable} from '@angular/core';

@Injectable()
export class PZConcreteSlumpRecord{
  public PZConcreteSlumpRecordID ;
  public SlumpNums ;
  public ActSlumpNums ;
  public PZConcreteID ;

}
export class PZSampleTongWidth{
  public PZSampleTongWidthID ;
  public DesignWidth ;
  public ActualWidth ;
  public PZConcreteID ;

  public constructor(){
    this.PZSampleTongWidthID = null;
    this.DesignWidth='';
    this.ActualWidth ='';
    this.PZConcreteID = null;
  }
}
export class PZTongRecord{
  public PZTongRecordID ;
  public TongNums ;
  public Standard ;
  public SameConditions ;
  public AntiSeepage;
  public MouldSplitting;
  public UsePlace;
  public PZConcreteID;
  public constructor(){
    this.PZTongRecordID = null;
    this.TongNums = '';
    this.Standard = '';
    this.SameConditions = '';
    this.AntiSeepage = '';
    this.MouldSplitting = '';
    this.UsePlace = '';
    this.PZConcreteID = null;
  }

}
export class PZCheckRecord{
  public PZCheckRecordID ;
  public Desc ;
  public PZCheckState ;
  public PZCheckType ;
  public  Problem ;
  public Suggestion ;
  public PangzhanID ;
  public constructor(){
    this.PZCheckRecordID = null;
    this.Desc = '';
    this.PZCheckState = '';
    this.PZCheckType = '';
    this.PangzhanID = '';
    this.Problem = '';
    this.Suggestion = '';
  }
}

export class PZType{
  public PZTypeID;
  public Desc;
  public constructor(){

  }
}


