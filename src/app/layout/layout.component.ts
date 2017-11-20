import { Component, OnInit,Input, HostBinding,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { slideInOutAnimation } from '../public/animations';
import { HttpClient } from "@angular/common/http";
import {NzNotificationService} from 'ng-zorro-antd';
import { AllData,PortName,SessionKey } from  '../public/publicData';
@Component({
  selector: 'layout-side',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  animations: [ slideInOutAnimation ],
  host: { '[@slideInOutAnimation]': '' }
})
export class LayoutSideComponent implements OnInit {
  _isSpinning:boolean=true;
  heroes = [];
  child = [];
  first:any = 0;
  second:any = 0;
  title:string = "";
  content:string = "";
  firstname:string = '';
  lastname:string = '';
  num:number = 0;
  userName:string = localStorage.getItem(SessionKey.MOBILE);
  constructor(
    private router:Router,
    private httpServer:HttpClient,
    private notification: NzNotificationService
  ) {
  }
  selectHero(hero,item){
    //alert(hero.route+":"+hero.routeid);
    this.second = item;
    this.lastname = hero.name;
    sessionStorage.setItem(SessionKey.SECOND,item);
    this.router.navigate([hero.route, hero.routeid]);
  }
  changeNav(obj,index){
    if(this.second != "0"&&index==this.first){
      return false;
    }
    this.first = index;
    this.firstname = obj.name;
    this.second = "0";
    this.child = obj.children;
    sessionStorage.setItem(SessionKey.FIRST,index);
    sessionStorage.setItem(SessionKey.SECOND,"0");
    this.selectHero(this.child[0],"0");
    this.lastname = this.child[0].name;
  }

  exit(){
    sessionStorage.clear();
    localStorage.removeItem(SessionKey.ISLOGGED);
    this.router.navigate(["login"]);

  }
  createNotification = (type) => {
    this.notification.create(type, this.title,this.content);
  };

  ngOnInit() {
    let urls = AllData.base_url+PortName.menu_list,
        urlports = AllData.base_url+PortName.admin_pending;
    let userid = sessionStorage.getItem(SessionKey.ID);
    let role = sessionStorage.getItem(SessionKey.ROLE);
    let key = {userId:userid,role:role};
    this.httpServer.post(urls,key).subscribe(res=> {
      let data = (res as any).detail;
      this.heroes = data;
      this.firstname = data[0].name;
      this.lastname =data[0].children[0].name;
      this.first = sessionStorage.getItem(SessionKey.FIRST);
      if(!this.first){
        this.first = 0;
      }
      this.second = sessionStorage.getItem(SessionKey.SECOND);
      if(!this.second){
        this.second = 0;
        this.child = this.heroes[0].children;
      }else{
        this.child = this.heroes[this.first].children;
      }
    });

    this.httpServer.post(urlports,key).subscribe(res=> {
      let data = (res as any).detail;
      if(role=="1"){
        this.num = data.library + data.record;
        this.title = "图书征集&档案征集有新增内容";
        this.content = "图书征集新增"+data.library+"条，档案征集新增"+data.record+"条";

      }else if(role=="2"){
        this.num = data.library;
        this.title = "图书征集有新增内容";
        this.content = "图书征集新增"+data.library+"条";

      }else if(role=="3"){
        this.num = data.record;
        this.title = "档案征集有新增内容";
        this.content = "档案征集新增"+data.record+"条";
      }else{
        this.num = 0;
        this.createNotification = ()=>{}
      }
    });


  }

  ngAfterViewInit(){
    this._isSpinning=false;
  }

}


