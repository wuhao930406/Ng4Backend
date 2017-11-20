import { Injectable }     from '@angular/core';
import { CanDeactivate }    from '@angular/router';
import { SessionKey } from  './public/publicData';
import { Router } from '@angular/router';

@Injectable()
export class CanLeaveProvide{
  canDeactivate(){
    if(localStorage.getItem(SessionKey.ISLOGGED)&&sessionStorage.getItem(SessionKey.ID)){
      return false;
    }else{
      //this.router.navigate(['login']);
      return true;
    }
  }
}
