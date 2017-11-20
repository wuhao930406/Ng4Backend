import { NgModule }             from '@angular/core';
import { RouterModule, Routes,CanActivate } from '@angular/router';
import { AuthService } from  './routereload';
import { CanLeaveProvide } from './routerleave';
import { HeroDetailComponent }  from './listdetail/hero-detail.component';
import { TimeLineComponent } from './timeline/time-line.component';
import { LoginComponent } from './login/app.component';
import { LayoutSideComponent } from './layout/layout.component';
import { PersonalComponent } from  './personal/personal.component';
import { AdminalComponent } from './adminal/adminal.component';
import { VideoMenuComponent } from './videomenu/videomenu.component';
import { LiskMenuComponent } from './liskmenu/liskmenu.component';
import { BookMenuComponent } from './bookmenu/bookmenu.component';
import { BookMenuaddAddComponent } from './bookmenuadd/bookmenuadd.component';
import { BookMenucnComponent } from './bookmenucom/bookmenucom.component';

import { CollectdetailaComponent } from "./collectdetaila/collectdetaila.component";
import { CollectDetailacnComponent } from './collectdetailacom/collectdetailacom.component';
import { CollectdetailbComponent } from "./collectdetailb/collectdetailb.component";
import { CollectDetailbcnComponent } from './collectdetailbcom/collectdetailbcom.component';
import { CollectDetailbAddComponent } from './collectdetailbadd/collectdetailbadd.component';
import { CenterComponent } from './center/center.component';
import { CollectdetailcComponent } from "./collectdetailc/collectdetailc.component";
import { CollectDetailccnComponent } from './collectdetailccom/collectdetailccom.component';
import { ShowlistComponent } from './zshowlist/showlist.component';
import { ShowListAddComponent } from './zshowlistadd/showlistadd.component';
import { ShowListcomComponent } from './zshowlistcom/showlistcom.component';
import { ZtintComponent } from './ztint/ztint.component';
import { ZtinTcComponent } from './ztintcom/ztintcom.component';
import { ZtintAddComponent } from './ztintadd/ztintadd.component';
import { ZtintEditComponent } from './ztintedit/ztintedit.component';

import { ListDetailcomComponent } from "./listdetailcom/listdetailcom.component";
import { ListDetailAddComponent } from  './listdetailadd/listdetailadd.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path:'login',component:LoginComponent},
  { path:'layout',
    component:LayoutSideComponent,
    canActivate:[AuthService],
    canDeactivate:[CanLeaveProvide],
    children:[
      {
        path: 'section1/01',
        component: HeroDetailComponent
      },
      {
        path: 'section1detail/:id',
        component: ListDetailcomComponent
      },
      {
        path: 'section1detailadd/:id',
        component: ListDetailAddComponent
      },
      {
        path: 'section1/02',
        component: CollectdetailbComponent
      },
      {
        path: 'section1detailb/:id',
        component: CollectDetailbcnComponent
      },
      {
        path: 'section1detailbadd/:id',
        component: CollectDetailbAddComponent
      },
      {
        path: 'section1/03',
        component: ShowlistComponent
      },
      {
        path: 'section1/04',
        component: ZtintComponent
      },
      {
        path: 'exbitionadd/:id',
        component: ShowListAddComponent
      },
      {
        path: 'lessonadd/:id',
        component: ZtintAddComponent
      },
      {
        path: 'lessonedit/:id',
        component: ZtintEditComponent
      },
      {
        path: 'exbitioncom/:id',
        component: ShowListcomComponent
      },
      {
        path: 'lessoncom/:id',
        component: ZtinTcComponent
      },
      {
        path: 'section2/04',
        component: CollectdetailaComponent
      },{
        path: 'section2detail/:id',
        component: CollectDetailacnComponent
      },
      {
        path: 'section2/05',
        component: CollectdetailcComponent
      },
      {
        path: 'section2detailb/:id',
        component: CollectDetailccnComponent
      },
      {
        path: 'section3/:id',
        component: TimeLineComponent
      },
      {
        path: 'section4/user/:id',
        component: PersonalComponent
      },
      {
        path: 'section4/admin/:id',
        component: AdminalComponent
      },
      {
        path: 'section5/book/:id',
        component: BookMenuComponent
      },
      {
        path: 'section5detail/:id',
        component: BookMenuaddAddComponent
      },
      {
        path: 'section5detailcn/:id',
        component: BookMenucnComponent
      },
      {
        path: 'section5/lisk/:id',
        component: LiskMenuComponent
      },{
        path: 'section5/video/:id',
        component: VideoMenuComponent
      },{
        path: 'percenter/:id',
        component: CenterComponent
      },

      {
        path:'',
        component:HeroDetailComponent
      }
    ]
  },
  {path:'**',component:LoginComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
