/**
 * Created by admin on 2017/9/19.
 */
import {trigger,state,animate,transition,style} from '@angular/animations';
const slideInOutAnimation =
  trigger('slideInOutAnimation',[
    state('*', style({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height:"100%",
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
    })),
    transition(':enter', [
      style({
        height: '0%',
        backgroundColor: 'rgba(0, 0, 0, 0)'
      }),
      animate('.2s ease-in-out',style({
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }))
    ]),
    transition(':leave', [
      animate('.2s ease-in-out',style({
        height: '0%',
        backgroundColor: 'rgba(0, 0, 0, 0)'
      }))
    ])
  ])
const fadeInAnimation =
  trigger('fadeInAnimation',[
    transition(':enter',[
      style({opacity:0}),
      animate('.2s',style({opacity:1}))
    ])
  ])
export {slideInOutAnimation,fadeInAnimation}
