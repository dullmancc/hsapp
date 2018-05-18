/**
 * Created by Administrator on 2017/5/3 0003.
 */
import {Injectable} from '@angular/core';

/**
 * Utils类存放和业务无关的公共方法
 * @description
 */
@Injectable()
export class Utils {

  constructor() {
  }

  static isEmpty(value): boolean {
    return value == null || typeof value === 'string' && value.length === 0;
  }

  static isNotEmpty(value): boolean {
    return !Utils.isEmpty(value);
  }

  /**
   * 格式“是”or“否”
   * @param value
   * @returns {string|string}
   */
  static formatYesOrNo(value: number|string): string {
    return value == 1 ? '是' : (value == '0' ? '否' : null);
  }


  static   GetTime(itemtime){
    let dateitem;
    dateitem = itemtime.substring(0,itemtime.indexOf('-'))+'年'+itemtime.substring(itemtime.indexOf('-')+1,itemtime.indexOf('T'))+itemtime.substring(itemtime.indexOf('T')+1);
    let year =itemtime.slice(0,4);
    let nowyear = new Date().getFullYear().toString();
    let month = dateitem.slice(5,7);
    let nowmonth = (new Date().getMonth()+1).toString();
    if(nowmonth.length==1){
      nowmonth = '0'+nowmonth;
    }
    let day  = dateitem.slice(8,10);
    let nowday = new  Date().getDate();
    // 08:00
    let hourmintes = dateitem.substr(dateitem.length-8,5);
    //04-27 08:00
    let monthhour =  dateitem.substr(5,dateitem.length-8).slice(0,5)+' '+hourmintes;
    //2018年04-27
    let YearMonth = dateitem.substr(0,10);
    if(year==nowyear){
      if(month==nowmonth&&day == nowday){
        return hourmintes;
      }else {
        return monthhour;
      }
    }else {
      return YearMonth;
    }
  }


  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                         年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                                "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                   "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 09:24:00"
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddThh:mm:ss+08:00')   "2017-02-28T09:24:00+08:00"
   * @returns {string}
   */
  static dateFormat(date: Date, sFormat:string = 'yyyy-MM-dd'): string {
    let time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond))
  }

  /**
   * 每次调用sequence加1
   * @type {()=>number}
   */
  getSequence = (function () {
    let sequence = 100;
    return function () {
      return ++sequence;
    };
  })();

  static StringToConstCase(sgCase:any){

    let str = "";
    let index = 0;

    let Constrcase = [
                       '1.采用',
                       '商品混凝土厂家生产的商品砼，',
                       '根振动棒振捣，现场有施工员' ,
                       '名，质检员',
                       '名，施工作业人员',
                       '名，完成的混凝土数量共有',
                        'm³，其中X层剪力墙、柱C40，',
                        'm³，Y层梁、板C30，',
      'm³,润滑砼泵管的砂浆已用接料斗另外装着，没有直接灌入柱、墙、板中。2.施工顺序、施工缝的处理均按施工方案进行施工。现场共抽查砼坍落度',
      '次，设计坍落度为',
      'mm，实际为',
      'mm，符合设计及规范要求,砼严禁加生水。现场共做混凝土试块10组，其中C30',
      '组，标养',
      '组，同条件',
      '组；C40',
      '组，标养',
      '组，同条件',
      '组。抽查了板砼的厚度共',
      '处，设计厚度为',
      'mm，实际为',
      '剪力墙、柱、梁、板浇捣顺序，剪力墙、柱与梁、板不同标号砼之间的处理措施严格按照施工方案执行。砼浇筑完后，施工单位对梁板砼表面进行了二次压实，并采用薄膜和（或）毛毡覆盖保养。\n施工情况附加信息:'
    ];

    for(let x in sgCase){
      str = str+ Constrcase[index]+sgCase[x];
      index++;
    }

    return str;
  }

  static ParamsToString(Params:any){

    let epParams = '';

    for(let x in Params){
      if(x=='EPCSParent'||x=='Employee'||x==''||x=='EPMaterialModel'||x=='EPMateInfoForEntries'||x=='EPEntryResult'||x=='MaterialUnit'){
        continue;
      }
      epParams = epParams + x +'='+ Params[x]+'&';
    }

    return epParams.substr(0,epParams.length-1);

  }

  //序列化对象
  static serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }
}
