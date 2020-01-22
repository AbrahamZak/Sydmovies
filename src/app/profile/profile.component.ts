import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: firebase.User; 
  constructor(private auth: AuthService, private router: Router) { }
  authError: any;
  changeSuccess = false;
  error = false;

  ngOnInit() {
    this.auth.getUserState()
        .subscribe( user => {
          this.user = user;
          if (this.user == null){
            this.router.navigate(['/login']);
          }
        })
  }

  changePassword(passwordChangeForm){
    this.changeSuccess = this.auth.changePassword(this.user, passwordChangeForm.value.currentPassword, passwordChangeForm.value.passwordChange, passwordChangeForm.value.passwordChangeConfirm);
    this.auth.eventAuthErrorReset$.subscribe(data=>{
      this.authError = data;
    })
    if (this.changeSuccess == true){
      this.error = false;
    }
    else{
      this.error = true;
    }
  }

}
