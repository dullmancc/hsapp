import {Injectable} from '@angular/core';

@Injectable()
export class User{
  public UserName:string;
  public Password:string;
  public grant_type:string;

  constructor(){

  }
}
