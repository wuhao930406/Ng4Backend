/**
 * Created by admin on 2017/9/28.
 */
import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { SessionKey } from  './public/publicData';
import { Router } from '@angular/router';
@Injectable()
export class AuthService implements CanActivate {
  constructor(
    private router:Router
  ){

  }
  canActivate() {
    if(localStorage.getItem(SessionKey.ISLOGGED)&&sessionStorage.getItem(SessionKey.ID)){
      return true;
    }else{
      this.router.navigate(['login']);
      return false;
    }
  }
}
