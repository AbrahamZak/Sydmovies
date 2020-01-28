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

    ngOnInit() {
      this.auth.getUserState()
        .subscribe( user => {
          this.user = user;
        })
}
login() {
  this.router.navigate(['/login']);
}

search(searchTerm){
  this.router.navigate(["/search/", searchTerm.value]);
}

profile() {
  this.router.navigate(['/profile']);
}

logout(){
  this.auth.logout();
  this.router.navigate(['/']);
}
}
