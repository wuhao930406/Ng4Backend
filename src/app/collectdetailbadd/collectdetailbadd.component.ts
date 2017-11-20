import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { cityList } from '../public/citys';
import { NzMessageService } from 'ng-zorro-antd';
import { DomSanitizer } from '@angular/platform-browser';

import {
  HttpEventType,
  HttpClient,
  HttpRequest
} from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import * as moment from "moment";
declare var $:any
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'collectdetailb-add',
  templateUrl: "./collectdetailbadd.component.html",
  styleUrls: [ './collectdetailbadd.component.css' ]
})

export class CollectDetailbAddComponent implements OnInit {
  validateForm: FormGroup;
  ids:string = "";
  id:string = sessionStorage.getItem(SessionKey.ID);
  fileList:Array<any> = [];
  names:string = "文件上传";
  seeurl:string = '';
  width:number = 900;

  previewImgFile:Array<any> = [];
  key:boolean = false;
  picid:string;
  timeperiod:Array<any> = [];
  previewImgSrcs:Array<any> = [];
  _isSpinning:boolean = true;

  checkOptionsOne = [
    { label: '精选', value: 'selected ',checked: false},
    { label: '新增', value: 'newadd ' ,checked: false},
  ];
  _log(value) {
    console.log(value);
  }

  _options = cityList.keys;
  _console(value) {
    console.log(value);
  }

  /*ups--*/
  randomWord(randomFlag, min, max){
    var str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if(randomFlag){
      range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
      var pos = Math.round(Math.random() * (arr.length-1));
      str += arr[pos];
    }
    return str;
  }

  isVisible = false;
  radomstr:string = '';
  src:any;
  showModal = (str) => {
    if(str=="文件上传"){
      this.names = str;
      this.width = 900;
    }else{
      this.width = 500;
    }

    this.isVisible = true;
  }

  handleCancel = (e) => {
    if(this.names=="查看图片"){

    }else{
      this.getfiles();
    }
    this.isVisible = false;
  }
  toDos(key,url,id,size,limit){
    if(key=="0"){
      this.names = "查看图片";
      this.seeurl = url;
      this.showModal("0");
    }else if(key=="1"){
      if(parseInt(size)>parseInt(limit)){
        this.createMessage("文件过大，暂不支持在线预览...")
        return;
      }
      this.createMessage("正在打开...")
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
      this.createMessage("该文件无法预览")
    }
  }

  getfiles(){
    let url = AllData.base_url+PortName.file_list;
    let data = {
      userId:this.id,
      rid:this.ids,
      type:2,
      uploadkey:this.radomstr
    }
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any);
      this.fileList = data.detail;

    })
  }
  remove(ids){
    let url = AllData.base_url+PortName.file_delete;
    let data = {
      userId:this.id,
      rid:this.ids,
      type:2,
      aid:ids
    }
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        this.createMessage("删除成功")
        this.getfiles()
      }
    })
  }
  /*--ups*/

  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
    }
    console.log(value);
  };

  resetForm($event: MouseEvent) {
    $event.preventDefault();
    this.validateForm.reset();
    this.checkOptionsOne = [
      { label: '精选', value: 'selected ',checked: false},
      { label: '新增', value: 'newadd ' ,checked: false},
    ];
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsPristine();
    }
    this._options = [];
    let it = this;
    setTimeout(function(){
      it._options = cityList.keys;
    },100)
  }


  nameAsyncValidator = (control: FormControl): any => {
    return Observable.create(function (observer) {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
  };

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  _disabledDate = function (current) {
    return current && current.getTime() > Date.now();
  };
  createMessage = (text) => {
    this._message.info(text);
  };

  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _message: NzMessageService,
    private httpServer:HttpClient
  ) {
    this.validateForm = this.fb.group({
      name                : [ '', [ Validators.required ], [ this.nameAsyncValidator ] ],
      address                : [ '', [ Validators.required  ] ],
      choosetype          : [ '',[]],
      keyword              : [ '', [ Validators.required ] ],
      status               : [ '', [ Validators.required  ] ],
      description         : [ '', [ Validators.required ] ],
      number              : [ '', [ Validators.required ] ],
      publishTime            : [ '', [ Validators.required ] ],
      period                : ['', [Validators.required ]],
      archive                : ['',[]],
      pic                   : [ '', []],
    });
  };
  toSet(){
    let urls = AllData.base_url+PortName.file_upload;
    let _it = this;
    if(this.previewImgFile.length==0){
      this.picid = null;
      return;
    }
    var formData = new FormData();
    formData.append("file",this.previewImgFile[0]);
    formData.append("userId",this.id);
    $.ajax({
      url : urls,
      type : 'POST',
      data : formData,
      processData : false,
      contentType : false,
      beforeSend:function(){
        console.log("正在进行，请稍候");
      },
      success : function(data) {
        if(data.code==200){
          _it.picid = data.detail.id;
        }
      },
      error : function(responseStr) {
        console.log("error");
      }
    });
  }
  submitFn(){
    if (this.previewImgSrcs.length==0) {
      this.key = true;
      this.createMessage('请上传封面图...')
      return
    }
    let newobj = this.validateForm.value;
    let toif = this.validateForm.value.choosetype;
    toif.forEach((item,index)=>{
      if(index==0 && item.checked==true){
        newobj.selected = "0";
      }else if(index==0 && item.checked!=true){
        newobj.selected = "1";
      }
      if(index==1&&item.checked==true){
        newobj.newadd  = "0";
      }else if(index==1&&item.checked!=true){
        newobj.newadd  = "1";
      }
    })
    delete newobj.choosetype;
    newobj.publishTime  = moment(newobj.publishTime ).format("YYYY-MM-DD");
    newobj.pic = this.picid;
    newobj.userId = this.id;
    //console.log(JSON.stringify(newobj))
    if(this.ids=="null"){

    }else{
      newobj.id = this.thisbookid;
    }
    let filea = this.fileList.map((item)=>{
      return item.id;
    }),files;
    files = filea.join(",");
    newobj.elecFile = files;

    let urls = AllData.base_url+PortName.record_save;
    this.httpServer.post(urls,newobj).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        this.createMessage("操作成功...")
        this.validateForm.reset();
        this.checkOptionsOne = [
          { label: '精选', value: 'selected ',checked: false},
          { label: '新增', value: 'newadd ' ,checked: false},
        ];
        this._options = [];
        this.fileList = [];
        let it = this;
        setTimeout(function(){
          it._options = cityList.keys;
        },100)

      }
    });

  }

  //**//
  name:string = '';
  address :string = '';
  keyword:string = "";
  status:string = '';
  description:string = "";
  number :string='';
  publishTime :string = '';
  period:string = '';
  archive:string = '';
  thisbookid:string = "";
  allsingle:Array<any> = [];
  ngOnInit() {
    this._options.forEach((item)=>{
     item.isLeaf = false;
    })
    let urls = AllData.base_url+PortName.file_time;
    let datas = { userId:this.id },it = this;
    this.httpServer.post(urls,datas).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        this.timeperiod = data.detail;
      }
    });

    let url = AllData.base_url+PortName.archive_list;
    this.httpServer.post(url,datas).subscribe(res=> {
      let data = (res as any).detail;
      this.allsingle = data;
      this._isSpinning = false;
    })


    this.route.params.subscribe(data => {
      this.ids = data['id'];
      if(this.ids=="null"){
        this.ids = '';
      }else{
        this.getfiles();
        let id = sessionStorage.getItem(SessionKey.ID);
        let url = AllData.base_url+PortName.record_get;
        let data = { userId:id,id:it.ids };
        it.httpServer.post(url,data).subscribe(res=> {
          let data = (res as any).detail;
          console.log(JSON.stringify(data));
          it.name = data.name;
          it.address  = data.address ;
          if(data.selected=='1'&&data.newadd=="1"){
            it.checkOptionsOne = [
              { label: '精选', value: 'selected ',checked: false},
              { label: '新增', value: 'newadd ' ,checked: false}
            ];
          }else if(data.selected=="0"&&data.newadd=="0"){
            it.checkOptionsOne = [
              { label: '精选', value: 'selected ',checked: true},
              { label: '新增', value: 'newadd ' ,checked: true}
            ];
          }else if(data.selected=='1'&&data.newadd=="0"){
            it.checkOptionsOne = [
              { label: '精选', value: 'selected ',checked: false},
              { label: '新增', value: 'newadd ' ,checked: true}
            ];
          }else if(data.selected=='0'&&data.newadd=="1"){
            it.checkOptionsOne = [
              { label: '精选', value: 'selected ',checked: true},
              { label: '新增', value: 'newadd ' ,checked: false}
            ];
          }
          it.keyword = data.keyword;
          it.status = data.status;
          it.description = data.description;
          it.number  = data.number ;
          it.publishTime  = data.publishTime ;
          it.period = data.period;
          it.archive = data.archive;
          it.picid = data.pic;
          it.previewImgSrcs.push(data.picurl);
          it.thisbookid = data.id;
          it.validateForm.setValue({
            name: data.name,
            address :data.address ,
            choosetype:it.checkOptionsOne,
            keyword:data.keyword,
            status:data.status,
            description:data.description,
            number :data.number ,
            publishTime :data.publishTime ,
            period:data.period,
            archive:data.archive,
            pic:data.pic,
          })


        })
      }
    });
    this.radomstr = this.randomWord(false,43,0);
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://180.96.16.167:1655?userId="+this.id+"&source=1&rid="+this.ids+"&type=2&uploadkey="+ this.radomstr);

  }
}





