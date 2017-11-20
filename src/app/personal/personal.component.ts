import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { _ } from "underscore";
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService,NzModalService } from 'ng-zorro-antd';
import * as moment from "moment"

@Component({
  selector: 'personal',
  templateUrl: './personal.component.html',
  styleUrls: [ './personal.component.css' ]
})

export class PersonalComponent implements OnInit {
  _isSpinning:boolean=true;
  data:Array<any> = [];
  inputValue:string;
  selectValue = "0";
  single:string = "";
  texts:string = "全部冻结";
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

  //对话框---
  isVisible = false;
  userad = "";
  pwdad = "";
  emailad = "";
  freezead = "";
  updateDatead = "";
  namead = "";
  idad = "";
  isConfirmLoading = false;
  isSee = false;
  showModal = (res,key) => {
    this.idad = res.id;
    this.userad = res.mobile;
    this.pwdad = res.password;
    this.emailad = res.email;
    if(res.freezeCN=="正常"){
      this.freezead = "0";
    }else{
      this.freezead = "1";
    }

    this.updateDatead = res.updateDate;
    this.isVisible = true;
    this.isSee = key;
    if(key){
      this.namead = "查看账号信息"
    }else{
      this.namead = "编辑账号信息"
    }
  }

  handleOk = (e) => {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  }

  handleCancel = (e) => {
    this.isVisible = false;
  }
  //对话框over

  filterNameArray = [
  ];

  sortMap = {
    "bookdesc": null,
    "author": null,
    "name": null,
    "picurl": null,
    "bookid": null,
    "uploadtime": null,
    "publictime": null,
    "press": null,
    "statusCN":null
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
    let urls = AllData.base_url+PortName.user_list;
    if(start=="Invalid date"){
      start = "";
    }
    if(end=="Invalid date"){
      end = "";
    }
    if(this.single=="0"){
      this.texts = "全部冻结"
    }else if(this.single=="1"){
      this.texts = "全部解冻"
    }
    let key = {
      userId:id,
      currentPage:this.pageindex,
      freeze:this.single,
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
      this.data = data.users;
      this.copyData = [ ...this.data ];
      this._displayData = this.data;
      this._displayData.forEach(value => value.checked = false);
      this._isSpinning = false;
      this._checkedArr = [];
      this._allChecked = false;
      return false;
    });
  }
  deleteAll(key,state){
    let url = AllData.base_url+PortName.user_deletes;
    let id = sessionStorage.getItem(SessionKey.ID),data,titles,contents,suceed;
    if(key){
      data = { userId:id,ids:key}
      if(state==0){
        url = AllData.base_url+PortName.user_deletes;
        titles = "确认冻结?";
        contents = "是否冻结当前选中条目?";
        suceed = "冻结成功";
      }else{
        url = AllData.base_url+PortName.user_undeletes;
        titles = "确认解冻?";
        contents = "是否解冻当前选中条目?";
        suceed = "解冻成功";
      }

    }else{
      let ifnull = ""
      var deletearr = this._checkedArr.map(function (item,index,input) {
        return item.id;
      })
      if(this.single=="0"){
        url = AllData.base_url+PortName.user_deletes;
        titles = "确认冻结?";
        contents = "是否冻结当前选中条目?";
        suceed = "冻结成功";
        ifnull = "请选择需要冻结的条目...";
      }else if(this.single=="1"){
        url = AllData.base_url+PortName.user_undeletes;
        titles = "确认解冻?";
        contents = "是否解冻当前选中条目?";
        suceed = "解冻成功";
        ifnull = "请选择需要解冻的条目...";
      }
      if(this._checkedArr.length==0){
        this.alertfn("warning",ifnull);
        return false;
      }
      let deletestr = JSON.stringify(deletearr);
      deletestr = deletestr.substring(1,deletestr.length-1);
      data = { userId:id,ids:deletestr}
    }
    let _it = this;
    this.comfirmfn(titles,contents,function(){
      _it.httpServer.post(url,data).subscribe(res=> {
        let code = (res as any).code;
        if(code==200){
          _it.alertfn("success",suceed);
          _it.getDatas();
        }

      })
    })
  }
  ngOnInit() {

  }

}





