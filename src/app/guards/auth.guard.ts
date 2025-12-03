import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: Auth,
    private router: Router
  ) { }

  async canActivate(): Promise<boolean> {
    const isLoggedIn$ = authState(this.auth).pipe(
      map(user => {
        if (user) return true;
        this.router.navigateByUrl('/login', { replaceUrl: true });
        return false;
      })
    );

    return await firstValueFrom(isLoggedIn$);
  }
}
