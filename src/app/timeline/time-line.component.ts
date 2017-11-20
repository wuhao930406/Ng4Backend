import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { _ } from "underscore";
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService,NzModalService } from 'ng-zorro-antd';
import * as moment from "moment";
@Component({
  selector: 'nz-demo-tabs-move',
  templateUrl: "./time-line.component.html",
  styleUrls: [ './time-line.component.css' ]
})
export class TimeLineComponent implements OnInit {
  ids:string;
  pagesize:number;
  pageindex:number=1;
  nztotal:number;
  total:number;
  single:string = "";
  timeperiod:string = "2013";
  tabs:Array<any> = [];
  links:Array<any> = [];
  id:string = sessionStorage.getItem(SessionKey.ID);
  nzTabPosition = 'top';
  selectedIndex = 0;
  _console(args) {
    this.timeperiod = args;
    this.pageindex = 1;
    this.getDatas();
  }
  _isSpinning:boolean = true;
  constructor(
    private httpServer:HttpClient,
    private route:ActivatedRoute
  ){

  }
  getDatas(){
    let urls = "";
    if(this.ids=="04"){
      urls = AllData.base_url+PortName.book_timeline;
    }else if(this.ids=="05"){
      urls = AllData.base_url+PortName.record_timeline;
    }else{
      urls = AllData.base_url+PortName.exhibition_timeline;

    }

    let data = {
      userId:this.id,
      timeperiod:this.timeperiod,
      currentPage:this.pageindex,
      status:this.single
    }
    this.httpServer.post(urls,data).subscribe(res=> {
      console.log(JSON.stringify(res))
      let data = (res as any);
      if(data.code==200){
        if(this.ids=="04"){
          this.links = data.detail.books;
        }else if(this.ids=="05"){
          this.links = data.detail.records;
        }else{
          this.links = data.detail.exhibitions;
        }
        this.pagesize = data.detail.page.showCount;
        this.pageindex = data.detail.page.currentPage;
        this.nztotal = data.detail.page.totalResult;

      }

    });

  }

  ngOnInit(){
    let urls = "";
    this.route.params.subscribe(data => {
      this.ids=data['id'];
      if(this.ids=="04"){
        urls = AllData.base_url+PortName.book_timeperiod;
      }else if(this.ids=="05"){
        urls = AllData.base_url+PortName.record_timeperiod;
      }else{
        urls = AllData.base_url+PortName.exhibition_timeperiod;
      }
    });
    let data = { userId:this.id }
    this.httpServer.post(urls,data).subscribe(res=> {
      console.log(JSON.stringify(res))
      let data = (res as any);
      if(data.code==200){
        this.tabs = data.detail;
        this.timeperiod = data.detail[0];
        this._isSpinning = false;
        this.total = this.tabs.length;
      }
    });
    this.getDatas();





  }

}





