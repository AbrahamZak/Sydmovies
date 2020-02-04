import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MoviesService } from '../movies.service';
import { Router } from '@angular/router';

@Component({ 
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: firebase.User; 
  constructor(private auth: AuthService, private router: Router, private movies: MoviesService) { }
  authError: any;
  changeSuccess = false;
  error = false;
  favorites: any;

  ngOnInit() {
    this.auth.getUserState()
        .subscribe( async user => {
          //Get the user's data if logged in
          this.user = user;
          //If the user is not logged in, go to homepage
          if (this.user == null){
            this.router.navigate(['/login']);
          }
          //Get the user's favorite list if they are logged in
          this.favorites = await this.movies.getFavorites(user.uid);
        })
  }

  //Submit the change password request and report any errors, if not report a success
  changePassword(passwordChangeForm){
    this.changeSuccess = this.auth.changePassword(this.user, passwordChangeForm.value.currentPassword, passwordChangeForm.value.passwordChange, passwordChangeForm.value.passwordChangeConfirm);
    this.auth.eventAuthErrorChange$.subscribe(data=>{
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
