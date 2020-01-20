import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: firebase.User;
  constructor(private auth: AuthService) { }
  authError: any;
  
  ngOnInit() {
    this.auth.getUserState()
        .subscribe( user => {
          this.user = user;
        })
  }

  changePassword(passwordChangeForm){
    this.auth.changePassword(this.user, passwordChangeForm.value.currentPassword, passwordChangeForm.value.passwordChange, passwordChangeForm.value.passwordChangeConfirm);
    this.auth.eventAuthErrorReset$.subscribe(data=>{
      this.authError = data;
    })
  }

}
