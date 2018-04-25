import {Injectable} from '@angular/core';

@Injectable()
export class EPCSFile{
  public  EPSecFileID ;
  public  FilePath ;
  public  FileName ;
  public  FileUpDateTime ;
  public  FileUpPerson ;
  public  EPCSID ;
  constructor(EPCSid,Fileupperson){
    this.EPCSID = EPCSid;
    this.EPSecFileID = "";
    this.FilePath = "";
    this.FileUpDateTime = "";
    this.FileUpPerson = Fileupperson;
    this.FileName = "";
  }
}
