import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  authError: any;
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  createUser(frm){
    this.auth.createUser(frm.value);
      this.auth.eventAuthError$.subscribe(data=>{
      this.authError = data;
      console.log(data);
    })
  }

}
