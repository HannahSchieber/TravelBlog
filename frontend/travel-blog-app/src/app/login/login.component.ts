import {Component, OnInit} from '@angular/core';
import {ApiService, User} from '../shared/api.service';
import {AuthService} from '../service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {BlogService} from '../shared/blog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public isLogin = true;

  public user: User;



  constructor(private api: ApiService, private auth: AuthService,
              private toastr: ToastrService, private data: BlogService) { }

  ngOnInit() {
    this.user = {
      username: '',
      password: '',
    };
  }


  public register(): void {
    if (!this.isLogin) {
      if (this.user.username !== '' && this.user.password !== '' && this.user.passwordAgain !== ''
        && (this.user.password === this.user.passwordAgain)) {
        const user = {
          username: this.user.username,
          password: this.user.password,
          phonenumber: this.user.phonenumber,
          email: this.user.email
        }
        this.api.registerUser(this.user).subscribe(elem => {
          console.log(elem);
          this.toastr.success(elem.message, 'Success!');
        });
      } else {
        console.log(this.user.password !== this.user.passwordAgain, this.user.password , this.user.passwordAgain)
        if (this.user.password !== this.user.passwordAgain) {
          this.toastr.warning('password mismatch!', 'Warning!');
        } else {
          this.toastr.warning('invalid credentials!', 'Warning!');
        }
        return;
      }
    }
    this.isLogin = !this.isLogin;
  }

  public login(): void {
    console.log(this.user);
    if (this.isLogin) {
      this.api.loginUser(this.user).subscribe(elem => {
        this.auth.login(elem);
        this.toastr.success('Welcome');
        console.log(this.auth.isAuthenticated());
      });
    } else {
      this.isLogin = !this.isLogin;
    }
  }

}
