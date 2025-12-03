import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  email = '';
  password = '';

  constructor(private auth: Auth, private router: Router) { }

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    } catch (err: any) {
      alert(err.message || 'Login failed');
    }
  }
}

