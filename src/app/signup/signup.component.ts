import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: firebase.User;
  authError: any;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    //If logged in go to homepage
    this.auth.getUserState()
    .subscribe( user => {
      this.user = user;
      if (this.user != null){
        this.router.navigate(['/']);
      }
    })
  }

  //Create a new user and report any errors
  createUser(frm){
    this.auth.createUser(frm.value);
      this.auth.eventAuthErrorSignUp$.subscribe(data=>{
      this.authError = data;
    })
  }

}
