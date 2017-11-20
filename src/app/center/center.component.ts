import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { _ } from "underscore";
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService,NzModalService } from 'ng-zorro-antd';
import * as moment from "moment";
@Component({
  selector: 'center-com',
  templateUrl: "./center.component.html",
  styleUrls: [ './center.component.css' ]
})
export class CenterComponent implements OnInit {
  _isSpinning:boolean = true;
  _isLoading:boolean = true;
  _isdisable:boolean = true;
  _string:string = "password";
  _sdk:boolean = false;
  dataList:any;
  new:string = "";
  surenew:string = "";
  text:string="修改密码";
  style:string='default';

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
    private router:Router,
    private httpServer:HttpClient,
    private route:ActivatedRoute,
    public _message:NzMessageService,
    private _modal:NzModalService
  ){

  }
  exit(){
    this.router.navigate(["login"]);
    sessionStorage.clear();
    localStorage.removeItem(SessionKey.ISLOGGED)
  }
  getDatas(){
    let id = sessionStorage.getItem(SessionKey.ID);
    let url = AllData.base_url+PortName.admin_get;
    let data = { userId:id,id:id };
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any).detail;
      this.dataList = data;
      this._isSpinning = false;
      setTimeout(()=>{
        this._isLoading =false
      },100)
    })
  }
  changeType(){
    if(this._sdk){
      this._string = "text";
    }else{
      this._string = "password"
    }
  }
  toChange(){
    if(this._isdisable == true){
      this.new = '';
      this.surenew = '';
      this._isdisable = false;
      this.text="提交";
      this.style = "danger";
    }else{
      let pwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
      if(this.new!=this.surenew || !this.new || !this.surenew){
        this.alertfn("error","密码为空或两次密码不一致...");
        return;
      }
      if (!pwd.test(this.new)) {
        this.alertfn("error",'密码必须由6-12位数字加字母组成...');
        return
      }

      let id = sessionStorage.getItem(SessionKey.ID);
      let url = AllData.base_url+PortName.admin_save;
      let data = { userId:id,id:id,password:this.surenew };
      this.httpServer.post(url,data).subscribe(res=> {
          let data = (res as any).code;
          if(data=='200'){
            this.alertfn("success","修改密码成功...");
            this.exit();
          }

      })

    }





  }

  ngOnInit(){
    this.getDatas();
  }
}
