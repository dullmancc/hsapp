import {Injectable} from '@angular/core';
import {Pangzhan} from "./EPPangzhan";
import {PZConcreteSlumpRecord, PZSampleTongWidth, PZTongRecord} from "./PZConcreteSlumpRecord";

@Injectable()
export class PZConcrete{
  public  EPCSID;
  public  ConcreteNums;
  public  PZCheckState1;
  public  PZCheckState3;
  public  PZCheckState2;
  public  PZCheckState4;
  public  PZCheckState5;
  public  PZCheckState6;
  public PZCheckState1Problem ;
  public PZCheckState1Suggestion ;
  public PZCheckState3Problem ;
  public PZCheckState3Suggestion ;
  public PZCheckState2Problem ;
  public PZCheckState2Suggestion ;
  public PZCheckState4Problem ;
  public PZCheckState4Suggestion ;
  public PZCheckState5Problem ;
  public PZCheckState5Suggestion ;
  public PZCheckState6Problem ;
  public PZCheckState6Suggestion ;

  public  Pangzhan;
  public  PZConcreteSlumpRecords:PZConcreteSlumpRecord[]=[];
  public  PZSampleTongWidths:PZSampleTongWidth[]=[];
  public  PZTongRecords:PZTongRecord[]=[];

  public constructor(){
    this.Pangzhan = new Pangzhan();
    this.EPCSID = '';
    this.ConcreteNums = '';
    this.PZCheckState1 = 1;
    this.PZCheckState3 = 1;
    this.PZCheckState2 = 1;
    this.PZCheckState4 = 1;
    this.PZCheckState5 = 1;
    this.PZCheckState6 = 1;
    this.PZCheckState1Problem = '';
    this.PZCheckState1Suggestion ='';
    this.PZCheckState3Problem ='';
    this.PZCheckState3Suggestion ='';
    this.PZCheckState2Problem = '';
    this.PZCheckState2Suggestion = '';
    this.PZCheckState4Problem = '';
    this.PZCheckState4Suggestion = '';
    this.PZCheckState5Problem = '';
    this.PZCheckState5Suggestion = '';
    this.PZCheckState6Problem = '';
    this.PZCheckState6Suggestion = '';
  }
}
