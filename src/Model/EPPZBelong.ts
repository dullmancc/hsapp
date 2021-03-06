import {Injectable} from '@angular/core';
import {Pangzhan} from "./EPPangzhan";

@Injectable()
export class PZBelong{
  public PZBelongId:any;
  public PZBelongName:string;
  public EProjectID:string;
  public Process;
  public Part;
  public ECUnitID;
  public BeginTime;
  public PZTypeID;

  public Pangzhans:Pangzhan[]=[];

  public constructor(){
    var datetime = new Date();
    this.PZBelongId = '';
    this.PZBelongName = '';
    this.EProjectID = '';
    this.Process = '';
    this.Part = '';
    this.ECUnitID = '';
    this.PZTypeID = '';
    this.BeginTime = datetime.getFullYear()+'/'+datetime.getMonth()+'/'+datetime.getDay()+' '+datetime.getHours()+':'+datetime.getMinutes();;
    this.Pangzhans = [];
  }

}
