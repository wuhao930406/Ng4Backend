import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { _ } from "underscore";
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService,NzModalService } from 'ng-zorro-antd';
import * as moment from "moment"

@Component({
  selector: 'adminal',
  templateUrl: './adminal.component.html',
  styleUrls: [ './adminal.component.css' ]
})

export class AdminalComponent implements OnInit {
  _isSpinning:boolean=true;
  data:Array<any> = [];
  inputValue:string;
  selectValue = "1";
  single:string = "";
  allsingle:Array<any> = [];
  _allChecked:boolean = false;
  _indeterminate:boolean = false;
  _displayData: Array<any> = [];//checked数组
  _checkedArr: Array<any> = [];//选中数组
  //分页变量
  pagesize:number;
  pageindex:number=1;
  nztotal:number;
  _startDate = null;
  _endDate = null;
  newArray = (len) => {
    const result = [];
    for (let i = 0; i < len; i++) {
      result.push(i);
    }
    return result;
  };
  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }else{
      this.getDatas();
    }
  };
  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }else{
      this.getDatas();
    }
  };
  _disabledStartDate = (startValue) => {
    if (!startValue || !this._endDate) {
      return startValue.getTime() > Date.now();
    }else{
      return startValue.getTime() >= this._endDate.getTime();
    }

  };
  _disabledEndDate = (endValue) => {
    if (!endValue || !this._startDate) {
      return endValue.getTime() > Date.now();
    }else{
      return endValue.getTime() <= this._startDate.getTime();
    }

  };

  filterNameArray = [
  ];
  //对话框---
  isVisible = false;
  userad = "";
  pwdad = "";
  rolead = "";
  updateDatead = "";
  namead = "";
  idad = "";
  isConfirmLoading = false;
  isSee = false;
  showModal = (res,key) => {
    this.isVisible = true;
    this.isSee = key;
    if(res=='null'){
      this.namead = "新增账号";
      this.userad = '';
      this.pwdad = '';
      this.rolead = null;
      this.updateDatead = new Date().toString();
      return false;
    }
    this.idad = res.id;
    this.userad = res.mobile;
    this.pwdad = res.password;
    this.rolead = res.role;
    this.updateDatead = res.createDate;

    if(key){
      this.namead = "查看账号信息"
    }else{
      this.namead = "编辑账号信息"
    }
  }

  handleOk = (e) => {
    let mobieReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    let pwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
    if (!mobieReg.test(this.userad)) {
      this.alertfn("error",'请输入正确的手机号...');
      return
    }
    if (!pwd.test(this.pwdad)) {
      this.alertfn("error",'密码必须由6-12位数字加字母组成...');
      return
    }

    this.isConfirmLoading = true;
    let id = sessionStorage.getItem(SessionKey.ID);
    let url = AllData.base_url+PortName.admin_save;
    let data;
    if(!this.idad){
      data = {
        userId:id,
        mobile:this.userad,
        password:this.pwdad,
        role:this.rolead
      };
    }else{
      data = {
        userId:id,
        id:this.idad,
        mobile:this.userad,
        password:this.pwdad,
        role:this.rolead
      };
    }
    this.httpServer.post(url,data).subscribe(res=> {
      let code = (res as any).code;
      if(code=="200"){
        this.isVisible = false;
        this.isConfirmLoading = false;
        this.getDatas();
        this.alertfn("success","修改成功");
      }
    })


  }

  handleCancel = (e) => {
    this.isVisible = false;
  }
  //对话框over

  sortMap = {
    "mobile": null,
    "email": null,
    "password": null,
    "updateDate": null,
    "id": null,
    "createDate": null,
    "publictime": null,
    "press": null,
    "roleCN":null
  };
  sortName = null;
  sortValue = null;

  copyData = [ ...this.data ];
  constructor(
    private route: ActivatedRoute,
    private httpServer:HttpClient,
    private _message:NzMessageService,
    private _modal:NzModalService
  ) {

  }
  alertfn = (type, text) => {
    this._message.create(type, text);
  };
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
  _refreshStatus() {
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
    this._checkedArr = this._displayData.filter(value => value.checked);
  };
  _checkAll(value) {
    if (value) {
      this._displayData.forEach(data => data.checked = true);
    } else {
      this._displayData.forEach(data => data.checked = false);
    }
    this._refreshStatus();
  };


  sort(sortName, value) {
    this.sortName = sortName;
    this.sortValue = value;
    Object.keys(this.sortMap).forEach(key => {
      if (key !== sortName) {
        this.sortMap[ key ] = null;
      } else {
        this.sortMap[ key ] = value;
      }
    });
    this.search();
  }

  search() {
    const searchName = this.filterNameArray.filter(name => name.value);
    const filterFunc = (item) => {
      return (searchName.length ? searchName.some(name => item.name.indexOf(name.name) !== -1) : true)
    };
    this.data = [ ...this.copyData.filter(item => filterFunc(item)) ];
    this.data = [ ...this.data.sort((a, b) => {
      if (a[ this.sortName ] > b[ this.sortName ]) {
        return (this.sortValue === 'ascend') ? 1 : -1;
      } else if (a[ this.sortName ] < b[ this.sortName ]) {
        return (this.sortValue === 'ascend') ? -1 : 1;
      } else {
        return 0;
      }
    }) ];
  }

  reset() {
    this.data= [];
    this.selectValue = "0";
    this.single = "";
    this._startDate = null;
    this._endDate = null;
    this._allChecked = false;
    this._indeterminate = false;
    this._displayData= [];//checked数组
    this._checkedArr= [];//选中数组
    this.pageindex =1;
    this.inputValue = "";
    this.getDatas();
  }
  getDatas(){
    let start = moment(this._startDate).format("YYYY-MM-DD");
    let end = moment(this._endDate).format("YYYY-MM-DD");
    let id = sessionStorage.getItem(SessionKey.ID);
    let urls = AllData.base_url+PortName.admin_list;
    if(start=="Invalid date"){
      start = "";
    }
    if(end=="Invalid date"){
      end = "";
    }

    let key = {
      userId:id,
      currentPage:this.pageindex,
      role:this.single,
      startDate:start,
      endDate:end,
      search_type:this.selectValue,
      search_content:this.inputValue
    };
    this.httpServer.post(urls,key).subscribe(res=> {
      console.log(JSON.stringify(res))
      let data = (res as any).detail;
      this.pagesize = data.page.showCount;
      this.pageindex = data.page.currentPage;
      this.nztotal = data.page.totalResult;
      this.data = data.admins;
      this.copyData = [ ...this.data ];
      this._displayData = this.data;
      this._displayData.forEach(value => value.checked = false);
      this._isSpinning = false;
      this._checkedArr = [];
      this._allChecked = false;
      return false;
    });
  }
  deleteAll(key){
    let url = AllData.base_url+PortName.admin_deletes;
    let id = sessionStorage.getItem(SessionKey.ID),data;
    if(key){
      data = { userId:id,ids:key}
    }else{
      var deletearr = this._checkedArr.map(function (item,index,input) {
        return item.id;
      })
      if(this._checkedArr.length==0){
        this.alertfn("warning","请选择需要删除的账号...");
        return false;
      }
      let deletestr = JSON.stringify(deletearr);
      deletestr = deletestr.substring(1,deletestr.length-1);
      data = { userId:id,ids:deletestr }
    }
    let _it = this;
    this.comfirmfn("确认删除？","是否删除当前选中账号",function(){
      _it.httpServer.post(url,data).subscribe(res=> {
        let code = (res as any).code;
        if(code==200){
          _it.alertfn("success","删除成功");
          _it.getDatas();
        }

      })
    })
  }
  ngOnInit() {
    let id = sessionStorage.getItem(SessionKey.ID);
    let url = AllData.base_url+PortName.role_list;
    let data = { userId:id };
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any).detail;
      this.allsingle = data;
    })
  }

}





