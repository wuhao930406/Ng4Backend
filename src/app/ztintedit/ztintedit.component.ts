import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { cityList } from '../public/citys';
import { NzMessageService,NzModalService } from 'ng-zorro-antd';
import { DomSanitizer } from '@angular/platform-browser';
import { NgStyle } from '@angular/common';
import {
  HttpEventType,
  HttpClient,
  HttpRequest
} from "@angular/common/http";
import { ActivatedRoute,Router } from '@angular/router';
import * as moment from "moment";
declare var $:any
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'ztint-edit',
  templateUrl: "./ztintedit.component.html",
  styleUrls: [ './ztintedit.component.css' ]
})

export class ZtintEditComponent implements OnInit {
  validateForm: FormGroup;
  ids:string = "";
  id:string = sessionStorage.getItem(SessionKey.ID);
  chapterid:string = '0';
  chid:string = '0';
  names:string = "文件上传";
  seeurl:string = '';
  width:number = 900;
  //image
  previewImgSrcs:Array<any> = [];
  previewImgFiles:Array<any> = [];
  previewImgSrc:Array<any> = [];
  previewImgFile:Array<any> = [];
  picid:string;
  picids:string;

  test(event){
    if (event.action == "remove") {
      this.ifedit = '0';
      this.ctile = "编辑小节";
      this.height = 'auto';
      this.getCharpter();
    }
  }
  options:Array<any>=[];
  indexs:number = -1;
  timeperiod:Array<any> = [];
  _isSpinning:boolean = true;
  charpterList:Array<any> = [];

//**//
  tosave(name,sort,id,item){
    if(this.indexs != item){
      this.createMessage("您未修改章节信息,无需修改...");
      return;
    }
    if(name == ''){
      this.createMessage("请填写章节名...");
      return;
    }

    let url = AllData.base_url+PortName.chapter_save;
    let data = { cid:this.ids,id :id,sectionname :name,sectionsort:sort};
    this.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        this.createMessage("修改成功");
        this.indexs = -1;
        this.getCharpter();
      }

    })
  }
  todels(id){
    if(!id){
      this.charpterList.pop();
      return
    }
    let url = AllData.base_url+PortName.chapter_deletes;
    let data = { userId:this.id,ids:id};
    let _it = this;
    this.comfirmfn("确认删除？","是否删除当前章节",function(){
      _it.httpServer.post(url,data).subscribe(res=> {
        let code = (res as any).code;
        if(code==200){
          _it.createMessage("删除成功");
          _it.getCharpter();
        }
      })
    })
  }
  addnew(){
    let num = this.charpterList.length;
    if(this.charpterList[num-1].sectionname==''){
      this.createMessage("请完善上一章节...");
      return
    }
    this.indexs = num;
    let obj={
      sectionname:'',
      sectionsort:num+1
    }
    this.charpterList.push(obj);
  }



  checkOptionsOne = [
    { label: '精选', value: 'selected ',checked: false},
    { label: '新增', value: 'newadd ' ,checked: false},
  ];

  //dom controller&&submit id or json
  ifchoose:number = 0;
  isVisible = false;
  ifedit:string = '0';
  height:string="auto";
  ctile:string = "";
  showModal = (key) => {
    if(key=="0"){
      this.ctile = "编辑小节";
    }else if(key=="1"){
      this.ctile = "修改/新增小节";
    }else{
      this.ctile = "编辑章节";
    }
    this.ifedit = key;
    this.height="auto";
    this.isVisible = true;
  }

  handleCancel = (e) => {
    let num = this.charpterList.length;
    if(this.charpterList[num-1].sectionname==''){
      this.createMessage("请完善章节再操作...");
      return
    }
    this.isVisible = false;
    //this.ifedit = 0;
  }




  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
    }
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
    this.names = "文件上传";
    this.seeurl = '';
    this.width = 900;

  }


  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  createMessage = (text) => {
    this._message.info(text);
  };


  toSet(previewImgFile,id,key){
    let urls = AllData.base_url+PortName.file_upload;
    let _it = this;
    if(previewImgFile.length==0){
      id = null;
      return;
    }
    var formData = new FormData();
    formData.append("file",previewImgFile[0]);
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
          id= data.detail.id;
          if(key==0){
            _it.picid = id;
          }else{
            _it.picids = id;
          }
        }
      },
      error : function(responseStr) {
        console.log("error");
      }
    });
  }
  changeRepeat(id,chid){
    this.chapterid = id;
    this.chid = chid;
    this.ifedit = '1';
    this.ctile = "修改/新增小节";
    this.height = '800px';
  }
  deleteRepeat(key,id){
    let url = AllData.base_url+PortName.video_deletes,data;
    let _it = this;
    if(key=="0"){
      data = { userId:this.id,ids:id };
    }else{
      let arr = this.charpterList[id].trifles;
      let newarr = arr.map((item)=>{
        return item.id;
      });
      let ids = newarr.join(",");
      alert(ids)
      data = { userId:this.id,ids:ids };
    }

    this.comfirmfn("确认删除？","是否删除当前小结",function(){
      _it.httpServer.post(url,data).subscribe(res=> {
        let code = (res as any).code;
        if(code==200){
          _it.createMessage("删除成功");
          _it.getCharpter();
        }
      })
    })

  }

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

  constructor(
    private _modal:NzModalService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router:Router,
    private _message: NzMessageService,
    private httpServer:HttpClient
  ){
    for(var i=1;i<30;i++){
      var item = {label:"第"+i+"章节",value:i};
      this.options.push(item);
    }
    this.validateForm = this.fb.group({
      title                : [ '', [ Validators.required ] ],
      choosetype          : [ '',[]],
      keyword              : [ '', [ Validators.required ] ],
      status               : [ '', [ Validators.required  ] ],
      description          : [ '', [ Validators.required ] ],
      pic                   : [ '', []],
      lecturerid           : ['', [ ]],
      lecturername         : [ '', [ ] ],
      lecturerdescription :[ '', [ ]],
      lecturerpic          : [ 0, []]
    });
  };

  getCharpter(){
    let it = this;
    let url = AllData.base_url+PortName.course_get;
    let data = { userId:it.id,id:it.ids };
    it.httpServer.post(url,data).subscribe(res=> {
      let data = (res as any).detail;
      console.log(JSON.stringify(data));
      it.charpterList = data.chapters;
      it.previewImgSrc[0] = data.picurl;
      it.previewImgSrcs[0] = data.lecturerpicurl;
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
      it.validateForm = this.fb.group({
        title                : [ data.title, [ Validators.required ] ],
        choosetype          : [ '',[]],
        keyword              : [ data.keyword, [ Validators.required ] ],
        status               : [ data.status, [ Validators.required  ] ],
        description          : [ data.description, [ Validators.required ] ],
        pic                   : [ data.pic, []],
        lecturerid           : [ data.lecturerid, [ ]],
        lecturername         : [ data.lecturername, [ ] ],
        lecturerdescription  :[ data.lecturerdescription, [ ]],
        lecturerpic          : [ data.lecturerpic, []]
      });
      setTimeout(()=>{
        it._isSpinning = false;
      },1000)

    })
  }


  ngOnInit() {
    let urls = AllData.base_url+PortName.lecturer_allList;
    let data = { userId:this.id },it = this;
    it.httpServer.post(urls,data).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        it.timeperiod = data.detail;
      }
    });
    it.route.params.subscribe(data => {
      it.ids=data['id'];
      if(it.ids=="null"){
        it.ids = '';
        setTimeout(()=>{
          it._isSpinning = false;
        },1000)
      }else{
        it.getCharpter();
      }
    });






  }
  submitFn(){
    if(this.previewImgSrc.length == 0){
      this.createMessage('请上传封面图...')
      return
    }
    let newobj = this.validateForm.value;
    if(this.ifchoose==0){
      newobj.lecturername = '';
      newobj.lecturerdescription = '';
      newobj.lecturerpic = '';
    }else{
      newobj.lecturerid = '';
      if(this.picids){
        newobj.lecturerpic = this.picids;
      }
    }
    if (this.previewImgSrcs.length==0&&this.ifchoose!=0||newobj.lecturername == ''&&this.ifchoose!=0||newobj.lecturerdescription == ''&&this.ifchoose!=0) {
      this.createMessage('请填写完整讲师信息...')
      return
    }
    if (newobj.lecturerid == ''&& this.ifchoose==0) {
      this.createMessage('请选择一位讲师...')
      return
    }

    if(this.picid){
      newobj.pic = this.picid;
    }
    newobj.userId = this.id;

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
    if(this.ids=="null"){
    }else{
      newobj.id = this.ids;
    }
    console.log(JSON.stringify(newobj))
    let urls = AllData.base_url+PortName.course_save;
    this.httpServer.post(urls,newobj).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        this.createMessage("操作成功");
        this.router.navigate(["/layout/section1/04"])
      }
    });

  }



}





