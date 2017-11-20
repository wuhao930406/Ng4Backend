import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { _ } from "underscore";
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService,NzModalService } from 'ng-zorro-antd';
import * as moment from "moment";
@Component({
  selector: 'collectdetailac-com',
  templateUrl: "./collectdetailccom.component.html",
  styleUrls: [ './collectdetailccom.component.css' ]
})
export class CollectDetailccnComponent implements OnInit {
  ids:string;
  dataList = {};
  downList:Array<any> = [];
  examine:string = '';
  isVisible = false;
  thisImg:string = "";
  id:string = sessionStorage.getItem(SessionKey.ID);


  showModal = (src) => {
    this.thisImg = src;
    this.isVisible = true;
  }

  handleCancel = (e) => {
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
  changeState(key){
    let id = sessionStorage.getItem(SessionKey.ID);
    let url = AllData.base_url+PortName.acollect_examine;
    let data = { userId:id,id:this.ids,examine:key },_it = this;
    this.comfirmfn("确认审核？","是否审核当前条目",function(){
      _it.httpServer.post(url,data).subscribe(res=> {
        let code = (res as any).code;
        if(code==200){
          _it.alertfn("success","审核完成");
          _it.getDatas();
        }

      })
    })


  }

  getDatas(){
    let id = sessionStorage.getItem(SessionKey.ID);
    let url = AllData.base_url+PortName.acollect_get;
    let data = { userId:id,id:this.ids };
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any).detail;
      this.dataList = data;
      this.downList = data.files;
      if(data.examine=="0"){
        this.examine = "待审核"
      }else if(data.examine=="1"){
        this.examine = "已通过"
      }else{
        this.examine = "未通过"
      }
    })
  }
  downAll(){
    let id = sessionStorage.getItem(SessionKey.ID);
    let idsArr = this.downList.map((item)=>{
      return  item.id;
    });
    if(idsArr.length==0){
      this.alertfn("warning","没有可下载的附件...")
      return;
    }

    let ids = JSON.stringify(idsArr);
    ids = ids.substring(1,ids.length-1);
    window.open( AllData.base_url + "/file/download?ids="+ids+"&userId=" + id)

  }
  downLoad(key){
    let id = sessionStorage.getItem(SessionKey.ID);
    window.open( AllData.base_url + "/file/download?ids="+key+"&userId=" + id)
  }
  toSee(key,url,id,size,limit){
    if(key=="0"){
      this.showModal(url);
    }else if(key=='1'){
      if(parseInt(size)>parseInt(limit)){
        this.alertfn("error","文件过大，暂不支持在线预览...")
        return;
      }
      this.alertfn("success","正在打开...")
      let url = AllData.base_url+PortName.file_preview;
      let data = {
        userId:this.id,
        id:id
      }
      this.httpServer.post(url,data).subscribe(res=> {
        let data = (res as any).detail;
        window.open(data.url)
      })
    }else{
      this.alertfn("warning","该文件无法在线预览...")
    }
  }


  ngOnInit(){
    this.route.params.subscribe(data => {
      this.ids=data['id'];
    });
    this.getDatas();
  }
}
