import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "../pages/Service/HttpService";

@Injectable()
export class QualityGJService{
  public MateInfo;
  public MateModel;
  //public input=[];
  public url='assets/data/GangJingInfo.json';
  public MateStandard;

  public constructor(private http:HttpService){
    this.getStandard();
  }

  public setMateInfo(MateInfo,MateModel){
      this.MateModel = MateModel;
      this.MateInfo = MateInfo;
      switch (MateInfo){
        case 'GJ00000':
          this.url = 'assets/data/GangJingInfo.json';
          break;
        default:
          break;
      }
  }

  public getStandard(){
    this.http.get(this.url).subscribe(res=>{
      this.MateStandard = res;
    },error=>{
      console.log(error);
    });
  }


}
