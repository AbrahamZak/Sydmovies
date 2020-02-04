import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: firebase.User;
  title = 'sydmovies';

  constructor(private auth: AuthService, 
    private router: Router) { }

    //Get the user state
    ngOnInit() {
      this.auth.getUserState()
        .subscribe( user => {
          this.user = user;
        })
}
//Login button function
login() {
  this.router.navigate(['/login']);
}

//Search button function
search(searchTerm){
  this.router.navigate(["/search/", searchTerm.value]);
}

//Profile button function
profile() {
  this.router.navigate(['/profile']);
}

//Logout button function
logout(){
  this.auth.logout();
  this.router.navigate(['/']);
}
}
