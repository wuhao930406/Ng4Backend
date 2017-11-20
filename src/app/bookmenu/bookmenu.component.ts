import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { _ } from "underscore";
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService,NzModalService } from 'ng-zorro-antd';
import * as moment from "moment"
@Component({
  selector: 'book-menu',
  templateUrl: "./bookmenu.component.html",
  styleUrls: [ './bookmenu.component.css' ]
})
export class BookMenuComponent implements OnInit {
  _isSpinning:boolean=true;
  data:Array<any> = [];
  inputValue:string;
  selectValue = "0";
  single:string = "";
  _allChecked:boolean = false;
  _indeterminate:boolean = false;
  _displayData: Array<any> = [];//checked数组
  _checkedArr: Array<any> = [];//选中数组
  //分页变量
  pagesize:number;
  pageindex:number=1;
  nztotal:number;
  _date = null;
  _disabledDate = function (current) {
    return current && current.getTime() > Date.now();
  };
  dateChange(){
    this.getDatas();
  }


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
    this._date = null;
    this._allChecked = false;
    this._indeterminate = false;
    this._displayData= [];//checked数组
    this._checkedArr= [];//选中数组
    this.pageindex =1;
    this.inputValue = "";
    this.getDatas();
  }

  state:string = '1';
  action:string="批量发布";
  getDatas(){
    let date = moment(this._date).format("YYYY-MM-DD");
    let id = sessionStorage.getItem(SessionKey.ID);
    if(this.single=='0'){
      this.action='批量发布';
      this.state = '1';
    }else if(this.single=='1'){
      this.action='批量下架';
      this.state = '2';
    }else if(this.single=='2'){
      this.action='批量发布';
      this.state = '1';
    }
    let urls = AllData.base_url+PortName.special_list;
    if(date=="Invalid date"){
      date = "";
    }
    let key = {
      userId:id,
      currentPage:this.pageindex,
      status:this.single,
      searchDate:date,
      searchType:this.selectValue,
      searchContent:this.inputValue
    };
    this.httpServer.post(urls,key).subscribe(res=> {
      console.log(JSON.stringify(res))
      let data = (res as any).detail;
      this.pagesize = data.page.showCount;
      this.pageindex = data.page.currentPage;
      this.nztotal = data.page.totalResult;
      this.data = data.specials;
      this.copyData = [ ...this.data ];
      this._displayData = this.data;
      this._displayData.forEach(value => value.checked = false);
      this._isSpinning = false;
      this._checkedArr = [];
      this._allChecked = false;
      this.filterNameArray = [];
      var newarrs = this.data.map(function (item,index,input) {
        return item.name;
      })
      // = new Set()
      newarrs = _.uniq(newarrs);
      for(var i = 0;i<newarrs.length;i++){
        var obj = {name:newarrs[i],value:false};
        this.filterNameArray.push(obj);
      }
      return false;
    });
  }
  setAction(){
    let url = AllData.base_url+PortName.special_publishs;
    let id = sessionStorage.getItem(SessionKey.ID),data;
    var deletearr = this._checkedArr.map(function (item,index,input) {
      return item.id;
    })
    if(this._checkedArr.length==0){
      this.alertfn("warning","请选择需要"+this.action+"的条目...");
      return false;
    }
    let deletestr = JSON.stringify(deletearr);
    deletestr = deletestr.substring(1,deletestr.length-1);
    data = { userId:id,ids:deletestr,status:this.state}
    let _it = this;
    this.comfirmfn("确认"+this.action+"？","是否"+this.action+"当前选中条目",function(){
      _it.httpServer.post(url,data).subscribe(res=> {
        let code = (res as any).code;
        if(code==200){
          _it.alertfn("success",_it.action+"成功");
          _it.getDatas();
        }

      })
    })
  }
  deleteAll(key){
    let url = AllData.base_url+PortName.special_delete;
    let id = sessionStorage.getItem(SessionKey.ID),data;
    if(key){
      data = { userId:id,ids:key}
    }else{
      var deletearr = this._checkedArr.map(function (item,index,input) {
        return item.id;
      })
      if(this._checkedArr.length==0){
        this.alertfn("warning","请选择需要删除的条目...");
        return false;
      }
      let deletestr = JSON.stringify(deletearr);
      deletestr = deletestr.substring(1,deletestr.length-1);
      data = { userId:id,ids:deletestr}
    }
    let _it = this;
    this.comfirmfn("确认删除？","是否删除当前选中条目",function(){
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



  }
}




