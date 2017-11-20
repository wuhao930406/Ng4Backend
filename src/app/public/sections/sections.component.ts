import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { AllData,PortName,SessionKey } from  '../publicData';
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


@Component({
  selector: 'sections-com',
  templateUrl: "./sections.component.html",
  styleUrls: [ './sections.component.css' ]
})

export class SectionsComponent implements OnInit {
  @Output() test: EventEmitter<any> = new EventEmitter();
  @Input() index:any;
  options:Array<any>=[];
  validateForm: FormGroup;
  ids:string = "";
  action:Object = {};
  id:string = sessionStorage.getItem(SessionKey.ID);
  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }
  repeat:Array<any> = [0];
  trifles:Array<any> = [
    {
      chaptername:'',
      chaptersort:1,
      video:"",
      elecFile:""
    }
  ];


  getChild(event){
    if(event.action=="remove"){
      if(event.index==0){
        this.createMessage("至少选择一个小节...");
        return;
      }
      this.trifles.splice(event.index,1);
      this.repeat.splice(event.index,1);
    }else{
      this.trifles[event.index] = event;
    }
  }
  addnew(){
    this.repeat.push(this.repeat.length);
    this.trifles.push({
      chaptername:'',
      chaptersort:this.trifles.length+1,
      video:"",
      elecFile:""
    })
  }

  changes(){
    let sections = this.validateForm.value;
    sections.trifles = this.trifles;
    this.test.emit(sections);
  }

  removi(index){
    this.action = { action:"remove",index:index };
    this.test.emit(this.action);
  }

  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
    }
  };

  createMessage = (text) => {
    this._message.info(text);
  };
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _message: NzMessageService
  ){
  };
  setchild(){
    this.repeat.length = this.validateForm.value.jie;
    for(var i=0;i<this.repeat.length;i++){
      this.repeat[i] = i;
    }

  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      sectionname              : [ '', [ Validators.required ] ],
      sectionsort              : [ this.index+1, [ Validators.required ] ],
      index                     :[this.index,[] ],
      jie                       :[1,[]]
    });
    for(var i=1;i<30;i++){
      var item = {label:"第"+i+"章",value:i};
      this.options.push(item);
    }

  }
}





