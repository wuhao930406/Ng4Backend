import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppRoutingModule } from  './app-route.module';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { QuillEditorModule } from 'ng2-quill-editor';
import { AuthService } from './routereload';
import { CanLeaveProvide } from './routerleave';
import { PreviewimgService } from './public/service';
import { HashLocationStrategy , LocationStrategy } from '@angular/common';
import { AppComponent } from './app.index';
import { LoginComponent } from './login/app.component';
import { FogotComponent } from './fogot/fogot.component';
import { LayoutSideComponent } from './layout/layout.component';
import { HeroDetailComponent } from './listdetail/hero-detail.component';
import { ListDetailcomComponent } from "./listdetailcom/listdetailcom.component";
import { ListDetailAddComponent } from  './listdetailadd/listdetailadd.component';

import { TimeLineComponent } from './timeline/time-line.component';
import { PersonalComponent } from  './personal/personal.component';
import { AdminalComponent } from './adminal/adminal.component';
import { VideoMenuComponent } from './videomenu/videomenu.component';
import { LiskMenuComponent } from './liskmenu/liskmenu.component';
import { BookMenuComponent } from './bookmenu/bookmenu.component';
import { BookMenuaddAddComponent } from './bookmenuadd/bookmenuadd.component';
import { BookMenucnComponent } from './bookmenucom/bookmenucom.component';
import { CollectdetailaComponent } from "./collectdetaila/collectdetaila.component";
import { CollectDetailacnComponent } from './collectdetailacom/collectdetailacom.component';
import { CenterComponent } from './center/center.component';
import { CollectdetailbComponent } from "./collectdetailb/collectdetailb.component";
import { CollectDetailbcnComponent } from './collectdetailbcom/collectdetailbcom.component';
import { CollectDetailbAddComponent } from './collectdetailbadd/collectdetailbadd.component';
import { ShowlistComponent } from './zshowlist/showlist.component';
import { ShowListAddComponent } from './zshowlistadd/showlistadd.component';
import { ShowListcomComponent } from './zshowlistcom/showlistcom.component';
import { ZtintComponent } from './ztint/ztint.component';
import { ZtinTcComponent } from './ztintcom/ztintcom.component';
import { ZtintAddComponent } from './ztintadd/ztintadd.component';
import { CollectdetailcComponent } from "./collectdetailc/collectdetailc.component";
import { CollectDetailccnComponent } from './collectdetailccom/collectdetailccom.component';
import { PreviewimgComponent } from './public/previewimg/previewimg.component';
import { SectionsComponent } from './public/sections/sections.component';
import { ChaptersComponent } from './public/chapters/chapters.component';
import { ZtintEditComponent } from './ztintedit/ztintedit.component';
import { NZ_NOTIFICATION_CONFIG } from "ng-zorro-antd";
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FogotComponent,
    CenterComponent,
    LayoutSideComponent,
    HeroDetailComponent,
    ListDetailcomComponent,
    ListDetailAddComponent,
    TimeLineComponent,
    PersonalComponent,
    AdminalComponent,
    VideoMenuComponent,
    LiskMenuComponent,
    BookMenuComponent,
    BookMenuaddAddComponent,
    BookMenucnComponent,
    CollectdetailaComponent,
    CollectDetailacnComponent,
    CollectdetailbComponent,
    CollectDetailbcnComponent,
    CollectDetailbAddComponent,
    CollectdetailcComponent,
    CollectDetailccnComponent,
    PreviewimgComponent,
    ShowlistComponent,
    ShowListAddComponent,
    ShowListcomComponent,
    ZtintComponent,
    ZtinTcComponent,
    ZtintAddComponent,
    SectionsComponent,
    ChaptersComponent,
    ZtintEditComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    QuillEditorModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule.forRoot()
  ],
  providers:[ PreviewimgService,AuthService,{provide: LocationStrategy, useClass: HashLocationStrategy},CanLeaveProvide,{ provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: "64px" } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
