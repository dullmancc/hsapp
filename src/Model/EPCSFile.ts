import {Injectable} from '@angular/core';

@Injectable()
export class EPCSFile{
  public  EPSecFileID ;
  public  FilePath ;
  public  FileName ;
  public  FileUpDateTime ;
  public  FileUpPerson ;
  public  EPCSID ;
  constructor(EPCSid,Fileupperson,EPSecFileid?,Filepath?){
    this.EPCSID = EPCSid;
    if(EPSecFileid) this.EPSecFileID = EPSecFileid;
    else this.EPSecFileID = "";
    if(Filepath) this.FilePath = Filepath;
    else this.FilePath = "";
    this.FileUpDateTime = "";
    this.FileUpPerson = Fileupperson;
    this.FileName = "";
  }
}
