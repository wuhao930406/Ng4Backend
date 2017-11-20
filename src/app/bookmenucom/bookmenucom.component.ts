import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { _ } from "underscore";
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService,NzModalService } from 'ng-zorro-antd';
import * as moment from "moment";
@Component({
  selector: 'bookmenu-com',
  templateUrl: "./bookmenucom.component.html",
  styleUrls: [ './bookmenucom.component.css' ]
})
export class BookMenucnComponent implements OnInit {
  ids:string;
  dataList = {};
  isVisible = false;
  thisImg = "";
  _isSpinning:boolean = true;
  showModal = (src) => {
    this.thisImg = src;
    this.isVisible = true;
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
  }
  comfirmfn(title,content,fn){
    this._modal.confirm({
      title  : title,
      content: '<b>'+content+'</b>',
      onOk() {
        fn()
      },
      onCancel() {
      }
    });
  }
  alertfn = (type, text) => {
    this._message.create(type, text);
  };
  constructor(
    private httpServer:HttpClient,
    private route:ActivatedRoute,
    public _message:NzMessageService,
    private _modal:NzModalService
  ){

  }


  getDatas(){
    let id = sessionStorage.getItem(SessionKey.ID);
    let url = AllData.base_url+PortName.special_get;
    let data = { userId:id,id:this.ids };
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any).detail;
      this.dataList = data;
      this._isSpinning = false;

    })
  }

  ngOnInit(){
    this.route.params.subscribe(data => {
      this.ids=data['id'];
    });
    this.getDatas();
  }
}
