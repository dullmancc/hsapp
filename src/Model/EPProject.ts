import {Injectable} from '@angular/core';

@Injectable()
export class Project {
  public EProjectID:number;    //项目id
  public Name:string;          //项目名称
  public EPState:number;       //项目状态
  public EPTypeId:number;      //项目类型id
  public EPType:string;        //项目类型名称
  constructor(){
    this.EProjectID=0;
    this.Name = '';
    this.EPState=0;
    this.EPTypeId =0 ;
    this.EPType ='';
  }
}
