import { Component,OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
@Component({
  selector: 'login-module',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class LoginComponent {
  user:string;
  pwd:string;
  captcha:string;
  remember:boolean = false;
  isLoadingOne:boolean=false;
  time:any = "获取验证码";
  num:number = 60;
  fogot:boolean = false;


  constructor(
    public httpServer:HttpClient,
    public fb:FormBuilder,
    public router:Router,
    public _message:NzMessageService
  ) {
  }
  validateForm:FormGroup;
  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }
  /*提示消息*/
  alertfn = (type, text) => {
    this._message.create(type, text);
  };

  /*定时器*/
  t = setInterval(()=>{
    if(this.num > 0){
      this.num --;
      this.time = " "+this.num+"s";
      sessionStorage.setItem(SessionKey.TIME,this.num.toString());
    }else{
      this.num = 60;
      this.time = "获取验证码";
      clearInterval(this.t);
      this.isLoadingOne = false;
    }
  },1000)


  landIn(){
    if(!this.user||!this.pwd||!this.captcha){
      return;
    }
    let keys = { mobile:this.user,password:this.pwd,code:this.captcha,userId:"" };
    this.httpServer.post(AllData.base_url+PortName.login, keys).subscribe(res=> {
      //console.log(JSON.stringify(res))
      let data = (res as any);
      if(data.code==200){
        localStorage.setItem(SessionKey.ISLOGGED,"1");
        localStorage.setItem(SessionKey.MOBILE,data.detail.mobile);
        if(this.remember){
          localStorage.setItem(SessionKey.PASSWORD,data.detail.password);
        }else{
          localStorage.setItem(SessionKey.PASSWORD,null);
        }

        sessionStorage.setItem(SessionKey.ID,data.detail.id);
        sessionStorage.setItem(SessionKey.ROLE,data.detail.role);
        this.router.navigate(['layout']);
      }else{
        this.alertfn("error",data.desc);
      }

    })
  }

  getCaptcha(e: MouseEvent) {
    if(!this.user){
      return;
    }
    let keys = { mobile:this.user,userId:"" };
    //http://106.14.192.196:8888/bookMainPage
    this.httpServer.post(AllData.base_url+PortName.login_code, keys).subscribe(res=> {
      let data = (res as any);
      if(data.code==201){
        this.alertfn("error",data.desc);
      }else{
        this.isLoadingOne = true;
        this.time = " "+this.num+"s";
        var t = setInterval(()=>{
          if(this.num > 0){
            this.num --;
            this.time = " "+this.num+"s";
            sessionStorage.setItem(SessionKey.TIME,this.num.toString());
          }else{
            this.num = 60;
            this.time = "获取验证码";
            clearInterval(t);
            this.isLoadingOne = false;
          }
        },1000)
      }
    });
    e.preventDefault();
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  exculiba(){
    this.fogot = false;
    let pwd = localStorage.getItem(SessionKey.PASSWORD);
    this.pwd = pwd;
  }
  ngOnInit() {
    let ifloading = parseInt(sessionStorage.getItem(SessionKey.TIME));
    let mobile = localStorage.getItem(SessionKey.MOBILE);
    let pwd = localStorage.getItem(SessionKey.PASSWORD);
    if(pwd&&pwd!="null"){
      this.user = mobile;
      this.pwd = pwd;
      this.remember = true;
      this.validateForm = this.fb.group({
        userName: [null, [Validators.required]],
        password: [null, [Validators.required]],
        captcha : [ null,[Validators.required ]],
        remember: [true],
      });
    }else{
      this.user = mobile;
      this.remember = false;
      this.validateForm = this.fb.group({
        userName: [null, [Validators.required]],
        password: [null, [Validators.required]],
        captcha : [ null,[Validators.required ]],
        remember: [false],
      });
    }

    if(ifloading==0||!ifloading){
      this.num = 60;
      clearInterval(this.t)
    }else{
      this.num = ifloading;
      this.isLoadingOne = true;
      this.t
    }






  }
}
