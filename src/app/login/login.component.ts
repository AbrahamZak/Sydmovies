import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: firebase.User; 
  authError: any;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.auth.getUserState()
    .subscribe( user => {
      this.user = user;
      if (this.user != null){
        this.router.navigate(['/']);
      }
    })
  }
  
  login(frm){
    this.auth.login(frm.value.email, frm.value.password);
    this.auth.eventAuthErrorLogin$.subscribe(data=>{
      this.authError = data;
    })
  }

}
