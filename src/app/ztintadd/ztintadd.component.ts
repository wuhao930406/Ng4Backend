import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { cityList } from '../public/citys';
import { NzMessageService } from 'ng-zorro-antd';
import { DomSanitizer } from '@angular/platform-browser';
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
import { SectionsComponent } from '../public/sections/sections.component';


@Component({
  selector: 'ztint-add',
  templateUrl: "./ztintadd.component.html",
  styleUrls: [ './ztintadd.component.css' ]
})

export class ZtintAddComponent implements OnInit {
  @ViewChild(SectionsComponent) child: SectionsComponent;
  validateForm: FormGroup;
  ids:string = "";
  id:string = sessionStorage.getItem(SessionKey.ID);
  fileList:Array<any> = [];
  fileLists:Array<any> = [];

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
  chapters:Array<any> = [
    {
      sectionname:'',
      sectionsort:1,
      trifles:[{
        chaptername:'',
        chaptersort:'',
        video:'',
        elecFile:''
      }]
    }
  ];
  repeat:Array<any> = [0];

  test(event){
    if(event.action=="remove"){
      if(event.index==0){
        this.createMessage("至少选择一个章节...");
        return;
      }
      this.chapters.splice(event.index,1);
      this.repeat.splice(event.index,1);
    }else{
      this.chapters[event.index] = event;
    }

  }
  addnew(){
    this.repeat.push(this.repeat.length);
    this.chapters.push({
      sectionname:'',
      sectionsort:this.chapters.length+1
    });
  }



  timeperiod:Array<any> = [];

  _isSpinning:boolean = true;
  thisbookid:string = "";

  checkOptionsOne = [
    { label: '精选', value: 'selected ',checked: false},
    { label: '新增', value: 'newadd ' ,checked: false},
  ];

  _console(value) {
    console.log(value);
  }
  //dom controller&&submit id or json
  ifchoose:number = 0;


  isVisible = false;
  isConfirmLoading = false;
  showModal = () => {
    this.isVisible = true;
  }

  handleCancel = (e) => {
    this.isVisible = false;
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
    this.fileList = [];
    this.fileLists = [];
    this.names = "文件上传";
    this.seeurl = '';
    this.width = 900;
    //image
    this.chapters = [
      {
        sectionname:'',
        sectionsort:1,
        trifles:[{
          chaptername:'',
          chaptersort:'',
          video:'',
          elecFile:''
        }]
      }
    ];
    this.repeat = [];
    setTimeout(()=>{
      this.repeat = [0];
    },200)
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
  changeRepeat(){
    let zhang = this.validateForm.value.zhang;
    this.repeat.length = zhang;
    for(var i=0;i<zhang;i++){
      this.repeat[i] = i;
    }
  }
  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router:Router,
    private _message: NzMessageService,
    private httpServer:HttpClient
  ){
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
      lecturerpic          : [ 0, []],
      zhang                 : [ 1, []]
    });
  };
  ngOnInit() {
    let urls = AllData.base_url+PortName.lecturer_allList;
    let data = { userId:this.id },it = this;
    it.httpServer.post(urls,data).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        it.timeperiod = data.detail;
      }
      setTimeout(()=>{
        this._isSpinning = false;
      },1000)
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
    let open = true;
    for(var i=0;i<this.chapters.length;i++){
      if(this.chapters[i].sectionname==''){
        open = false;
      }
      for(var j=0;j<this.chapters[i].trifles.length;j++ ){
        if(this.chapters[i].trifles[j].chaptername==''||this.chapters[i].trifles[j].video==''){
          open = false;
        }
      }
    }
    console.log(JSON.stringify(this.chapters));
    if(open==false){
      this.createMessage("章节内容没有填写完整，请检查...");
      return
    }
    newobj.chapters = this.chapters;
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
      newobj.id = this.thisbookid;
    }

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





