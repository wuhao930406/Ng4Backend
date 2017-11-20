import { Component,OnInit,EventEmitter,Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
@Component({
  selector: 'fogot-module',
  templateUrl: './fogot.component.html',
  styleUrls: ['./fogot.component.css']
})
export class FogotComponent {
  user:string;
  pwd:string;
  captcha:string;
  remember:boolean = false;
  isLoadingOne:boolean=false;
  time:any = "获取验证码";
  num:number = 60;
  fogot:boolean = false;
  @Output() landed: EventEmitter<boolean> = new EventEmitter();


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
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    let pwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
    if (!control.value) {
      return { required: true };
    } else if (!pwd.test(this.validateForm.controls[ 'password' ].value)) {
      return { confirm: true, error: true };
    }
  };
  /*定时器*/
  t = setInterval(()=>{
    if(this.num > 0){
      this.num --;
      this.time = " "+this.num+"s";
      sessionStorage.setItem(SessionKey.TIMEZ,this.num.toString());
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
    this.httpServer.post(AllData.base_url+PortName.admin_retrieve, keys).subscribe(res=> {
      //console.log(JSON.stringify(res))
      let data = (res as any);
      if(data.code==200){
        this.alertfn("success","修改密码成功,您当前的密码是"+this.pwd);
        localStorage.setItem(SessionKey.PASSWORD,this.pwd);
        this.validateForm = this.fb.group({
          userName: [null, [Validators.required]],
          password: [null, [Validators.required,this.confirmationValidator]],
          captcha : [ null,[Validators.required ]],
        });
        this.landed.emit(false);

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
    this.httpServer.post(AllData.base_url+PortName.admin_retrieve_code, keys).subscribe(res=> {
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
            sessionStorage.setItem(SessionKey.TIMEZ,this.num.toString());
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

  ngOnInit() {
    let ifloading = parseInt(sessionStorage.getItem(SessionKey.TIMEZ));
    let mobile = localStorage.getItem(SessionKey.MOBILE);
    let pwd = localStorage.getItem(SessionKey.PASSWORD);
    if(!mobile){
      mobile = '';
    }
    this.user = mobile;
    this.validateForm = this.fb.group({
      userName: [mobile, [Validators.required]],
      password: [null, [Validators.required,this.confirmationValidator]],
      captcha : [ null,[Validators.required ]],
    });
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
