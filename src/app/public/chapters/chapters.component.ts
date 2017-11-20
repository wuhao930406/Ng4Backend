import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { AllData,PortName,SessionKey } from  '../publicData';
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


@Component({
  selector: 'chapters-com',
  templateUrl: "./chapters.component.html",
  styleUrls: [ './chapters.component.css' ]
})

export class ChaptersComponent implements OnInit {
  @Output() test: EventEmitter<any> = new EventEmitter();
  @Input() index:any ;
  @Input() chapterid:string = '';
  @Input() chid:string = '';
  num = 12;
  options:Array<any>=[];
  action:Object = {};
  validateForm: FormGroup;
  id:string = sessionStorage.getItem(SessionKey.ID);
  fileList:Array<any> = [];
  fileLists:Array<any> = [];
  names:string = "文件上传";
  seeurl:string = '';
  width:number = 900;
  txt = "删除";

  changes(){
    let obj = this.validateForm.value;
    if(this.fileLists.length==0){
      this.createMessage("请上传视频...");
      return
    }
    let video = this.fileLists[0].id;
    let arrs = []
    for(var i=0;i<this.fileList.length;i++){
      arrs.push(this.fileList[i].id);
    }
    let arr = arrs.join(",");
    obj.video = video
    obj.elecFile = arr;
    this.test.emit(obj);
  }
  removi(index){
    this.action = { action:"remove",index:index };
    this.test.emit(this.action);
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
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://180.96.16.167:1655?userId="+this.id+"&source=1&rid="+this.chapterid+"&type=7&uploadkey="+ this.radomstr);
    }else if(str=="上传视频"){
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl("http://180.96.16.167:1655/single.html?userId="+this.id+"&source=1&rid="+this.chapterid+"&type=6&uploadkey="+ this.radomstrs);
      this.width = 900;
    }else{
      this.width = 500;
    }
    this.isVisible = true;
  }

  handleCancel = (e) => {
    if(this.names=="查看图片"){
    }else if(this.names=="上传视频"){
      this.getfiles(this.radomstrs,6);
    }else{
      this.getfiles(this.radomstr,7);
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
      rid:this.chapterid,
      type:num,
      uploadkey:uploadkey
    }
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any);
      if(num == 6){
        this.fileLists = data.detail;
        if(data.detail.length==0){
          return
        }
        this.validateForm.value.video = data.detail[0].id;
        let sections = this.validateForm.value;
        this.test.emit(sections);
      }else{
        this.fileList = data.detail;
        let arrs = []
        for(var i=0;i<this.fileList.length;i++){
          arrs.push(this.fileList[i].id);
        }
        let arr = arrs.join(",");
        this.validateForm.value.elecFile = arr;
        let sections = this.validateForm.value;
        this.test.emit(sections);
      }
    })
  }
  remove(ids,key){
    let url = AllData.base_url+PortName.file_delete;
    let data = {
      userId:this.id,
      rid:this.chapterid,
      type:key,
      aid:ids
    }
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        this.createMessage("删除成功");
        if(key==6){
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

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  createMessage = (text) => {
    this._message.info(text);
  };
  changed(){
    let obj = this.validateForm.value;
    if(this.fileLists.length==0){
      this.createMessage("请上传视频...");
      return
    }
    let video = this.fileLists[0].id;
    let arrs = []
    for(var i=0;i<this.fileList.length;i++){
      arrs.push(this.fileList[i].id);
    }
    let arr = arrs.join(",");
    obj.video = video
    obj.elecFile = arr;
    delete obj.index;
    obj.id = this.chapterid;
    if(this.chid==''){

    }else{
      obj.chid = this.chid;
    }

    console.log(JSON.stringify(obj));
    let url = AllData.base_url+PortName.video_save;
    let it = this;
    this.httpServer.post(url,obj).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        it.createMessage("修改成功");
        it.action = { action:"remove",index:'0' };
        it.test.emit(it.action);
      }


    })


  }
  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _message: NzMessageService,
    private httpServer:HttpClient
  ){
    for(var i=1;i<30;i++){
      var item = {label:"第"+i+"小节",value:i};
      this.options.push(item);
    }
    this.validateForm = this.fb.group({
      chaptername          : [ '', [ Validators.required ] ],
      chaptersort          : [ this.index+1, [ Validators.required ] ],
      video                 : [ '', [ ] ],
      elecFile              : [ '', [ ] ],
      index                 : [ this.index, [ ] ]
    });
  };
  ngOnInit(){
    if(!this.chapterid&&!this.chid){
      this.num = 12;
      this.txt = "删除";
      this.validateForm = this.fb.group({
        chaptername          : [ '', [ Validators.required ] ],
        chaptersort          : [ this.index+1, [ Validators.required ] ],
        video                 : [ '', [ ] ],
        elecFile              : [ '', [ ] ],
        index                 : [ this.index, [ ] ]
      });
    }else{
      this.txt = "返回";
      this.num = 24;
      if(this.chapterid){
        this.getfiles('',6);
        this.getfiles('',7);
        let url = AllData.base_url+PortName.video_get;
        let data = { userId:this.id,id:this.chapterid };
        let it = this;
        this.httpServer.post(url,data).subscribe(res=> {
          let data = (res as any).detail;
          this.index = data.chaptersort-1;
          it.validateForm = it.fb.group({
            chaptername          : [ data.chaptername, [ Validators.required ] ],
            chaptersort          : [ data.chaptersort, [ Validators.required ] ],
            video                : [ data.video, [ ] ],
            elecFile             : [ data.elecFile, [ ] ],
            index                 : [ data.chaptersort-1, [ ] ]
          });
        })
      }



    }

    this.radomstr = this.randomWord(false,43,0);
    this.radomstrs = this.randomWord(false,43,0);



  }
}





