import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AllData,PortName,SessionKey } from  '../public/publicData';
import { NzMessageService } from 'ng-zorro-antd';
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
  selector: 'bookmenu-add',
  templateUrl: "./bookmenuadd.component.html",
  styleUrls: [ './bookmenuadd.component.css' ]
})

export class BookMenuaddAddComponent implements OnInit {
  validateForm: FormGroup;
  title:string = '';
  status:string = '';
  description:string = "";
  thisbookid:string = "";
  context:string = "";
  editorOptions = {
    placeholder: "请填写发布文本..."
  };
  ids:string = "";
  id:string = sessionStorage.getItem(SessionKey.ID);
  previewImgFile:Array<any> = [];
  key:boolean = false;
  picid:string;
  timeperiod:Array<any> = [];
  previewImgSrcs:Array<any> = [];
  _isSpinning:boolean = true;


  onContentChanged({ html, text }) {
    console.log(html, text);
  }



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
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsPristine();
    }
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

  createMessage = (text) => {
    this._message.info(text);
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _message: NzMessageService,
    private httpServer:HttpClient,
  ) {
    this.validateForm = this.fb.group({
      title               : [ '', [ Validators.required ], [ this.nameAsyncValidator ] ],
      status              : [ '', [ Validators.required  ] ],
      description         : [ '', [ Validators.required ] ],
      pic                  : [ '', []],
      context             :[ '', []]
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
    newobj.pic = this.picid;
    newobj.userId = this.id;
    if(this.ids=="null"){
    }else{
      newobj.id = this.thisbookid;
    }
    let urls = AllData.base_url+PortName.special_save,it = this;
    this.httpServer.post(urls,newobj).subscribe(res=> {
      let data = (res as any);
      if(data.code==200){
        this.createMessage("mmp终于好了")
        this.validateForm.reset();
      }
    });

  }


  ngOnInit() {
    let it = this;

    this.route.params.subscribe(data => {
      this.ids=data['id'];
      if(this.ids=="null"){
        this._isSpinning = false;
      }else{
        let id = sessionStorage.getItem(SessionKey.ID);
        let url = AllData.base_url+PortName.special_get;
        let data = { userId:id,id:it.ids };
        it.httpServer.post(url,data).subscribe(res=> {
          this._isSpinning = false;
          let data = (res as any).detail;
          console.log(JSON.stringify(data));
          it.title = data.title;
          it.status = data.status;
          it.description = data.description;
          it.picid = data.pic;
          it.previewImgSrcs.push(data.picurl);
          it.thisbookid = data.id;
          it.context = data.context;
          it.validateForm.setValue({
            title: data.title,
            status:data.status,
            description:data.description,
            pic:data.pic,
            context:data.context
          })


        })
      }
    });


  }
}





