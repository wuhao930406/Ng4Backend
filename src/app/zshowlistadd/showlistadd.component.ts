import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService } from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
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
  selector: 'showlistadd-add',
  templateUrl: "./showlistadd.component.html",
  styleUrls: [ './showlistadd.component.css' ]
})

export class ShowListAddComponent implements OnInit {
  validateForm: FormGroup;
  ids:string = "";
  id:string = sessionStorage.getItem(SessionKey.ID);
  fileList:Array<any> = [];
  fileLists:Array<any> = [];

  names:string = "文件上传";
  seeurl:string = '';
  width:number = 900;

  previewImgFile:Array<any> = [];
  picid:string;
  timeperiod:Array<any> = [];
  previewImgSrcs:Array<any> = [];
  _isSpinning:boolean = true;
  thisbookid:string = "";




  checkOptionsOne = [
    { label: '精选', value: 'selected ',checked: false},
    { label: '新增', value: 'newadd ' ,checked: false},
  ];
  _log(value) {
    console.log(value);
  }

  _console(value) {
    console.log(value);
  }
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
  radomstrs:string="";
  src:any;
  showModal = (str) => {
    this.names = str;
    if(str=="文件上传"){
      this.width = 900;
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://180.96.16.167:1655?userId="+this.id+"&source=1&rid="+this.ids+"&type=5&uploadkey="+ this.radomstr);
    }else if(str=="上传视频"){
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://180.96.16.167:1655/single.html?userId="+this.id+"&source=1&rid="+this.ids+"&type=4&uploadkey="+ this.radomstrs);
      this.width = 900;
    }else{
      this.width = 500;
    }
    this.isVisible = true;
  }

  handleCancel = (e) => {
    if(this.names=="查看图片"){

    }else if(this.names=="上传视频"){
      this.getfiles(this.radomstrs,4);
    }else{
      this.getfiles(this.radomstr,5);
    }
    this.isVisible = false;
  }
  toDos(key,url,id,size,limit){
    if(key=="0"){
      this.seeurl = url;
      this.showModal("查看图片");
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

  getfiles(uploadkey,num){
    let url = AllData.base_url+PortName.file_list;
    let data = {
      userId:this.id,
      rid:this.ids,
      type:num,
      uploadkey:uploadkey
    }
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any);
      if(num == 4){
        this.fileLists = data.detail;
      }else{
        this.fileList = data.detail;
      }
    })
  }
  remove(ids,key){
    let url = AllData.base_url+PortName.file_delete;
    let data = {
      userId:this.id,
      rid:this.ids,
      type:key,
      aid:ids
    }
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        this.createMessage("删除成功");
        if(key==4){
          this.getfiles(this.radomstrs,key)
        }else{
          this.getfiles(this.radomstr,key)
        }
      }
    })
  }


  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
    }
  };
  removeAll(){
    //let url = AllData.base_url+PortName.file_delete;
    //let data = {
    //  userId:this.id,
    //  rid:this.ids,
    //  type:key,
    //  aid:ids
    //}
    //this.httpServer.post(url,data).subscribe(res=> {
    //  let data = (res as any);
    //  if(data.code==200){
    //    this.createMessage("删除成功");
    //    if(key==4){
    //      this.getfiles(this.radomstrs,key)
    //    }else{
    //      this.getfiles(this.radomstr,key)
    //    }
    //  }
    //})
  }
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
    this.fileList = [];
    this.fileLists = [];
    let it = this;

  }


  nameAsyncValidator = (control: FormControl): any => {
    return Observable.create(function (observer) {
      setTimeout(() => {
        if (control.value === '') {
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

  createMessage = (text) => {
    this._message.info(text);
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
      this.createMessage('请上传封面图...')
      return
    }
    if(this.fileLists.length == 0){
      this.createMessage('请上传视频文件...')
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
    if(this.picid){
      newobj.pic = this.picid;
    }
    newobj.userId = this.id;
    let filea = this.fileList.map((item)=>{
      return item.id;
    }),files;
    files = filea.join(",");
    newobj.elecFile = files;
    newobj.video = this.fileLists[0].id;

    console.log(JSON.stringify(newobj))
    if(this.ids=="null"){

    }else{
      newobj.id = this.thisbookid;
    }

    let urls = AllData.base_url+PortName.exhibition_save;
    this.httpServer.post(urls,newobj).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        this.createMessage("操作成功")
        this.validateForm.reset();
        this.checkOptionsOne = [
          { label: '精选', value: 'selected ',checked: false},
          { label: '新增', value: 'newadd ' ,checked: false},
        ];
        this.fileList = [];
        this.fileLists = [];
        let it = this;
      }
    });

  }


  //**//
  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _message: NzMessageService,
    private httpServer:HttpClient
  ){
    this.validateForm = this.fb.group({
      title                : [ '', [ Validators.required ], [ this.nameAsyncValidator ] ],
      choosetype          : [ '',[]],
      keyword              : [ '', [ Validators.required ] ],
      status               : [ '', [ Validators.required  ] ],
      description         : [ '', [ Validators.required ] ],
      period                : ['', [Validators.required ]],
      pic                   : [ '', []],
      video                 : [ '', []],
      elecFile              :['',[]]
    });
  };
  ngOnInit() {
    let urls = AllData.base_url+PortName.file_time;
    let data = { userId:this.id },it = this;
    this.httpServer.post(urls,data).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        this.timeperiod = data.detail;
      }
    });
    this.route.params.subscribe(data => {
      this.ids=data['id'];
      if(this.ids=="null"){
        this.ids = '';
        setTimeout(()=>{
          this._isSpinning = false;
        },1000)
      }else{
        this.getfiles("",4);
        this.getfiles("",5);
        let id = sessionStorage.getItem(SessionKey.ID);
        let url = AllData.base_url+PortName.exhibition_get;
        let data = { userId:id,id:it.ids };
        it.httpServer.post(url,data).subscribe(res=> {
          let data = (res as any).detail;
          console.log(JSON.stringify(data));
          it.previewImgSrcs.push(data.picurl);
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
          it.validateForm = it.fb.group({
            title                : [ data.title, [ Validators.required ], [ it.nameAsyncValidator ] ],
            choosetype           : [ '',[]],
            keyword              : [ data.keyword, [ Validators.required ] ],
            status               : [ data.status, [ Validators.required  ] ],
            description         :  [ data.description, [ Validators.required ] ],
            period               : [ data.period, [Validators.required ]],
            pic                  : [ data.pic, []],
            video                : [ data.video, []],
            elecFile             : [ data.elecFile,[]]
          });
          setTimeout(()=>{
            it._isSpinning = false;
          },1000)





        })
      }
    });
    this.radomstr = this.randomWord(false,43,0);
    this.radomstrs = this.randomWord(false,43,0);
   // alert(this.radomstr+":"+this.radomstrs)


  }
}





