import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  user: firebase.User; 
  authError: any;
  error = false;
  success = false;

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

  async forgot(frm){
    this.success = false;
    this.auth.eventAuthErrorReset$.subscribe(data=>{
      this.authError = data;
    })
    var changeSuccess = await this.auth.resetPassword(frm.value.email).then();
    if (changeSuccess == true){
      this.error = false;
      this.success = true;
    }
    else{
      this.error = true;
    }
  }
}
