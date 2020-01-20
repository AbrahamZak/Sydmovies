import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private eventAuthError = new BehaviorSubject<any>("");
  eventAuthError$ = this.eventAuthError.asObservable();

  newUser: any;

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router) { }

    getUserState(){
      return this.afAuth.authState;
    }

    login( email: string, password: string) {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
          if (error.message == "The email address is badly formatted."){
            error.message = "Please enter a valid email."
          }
          else if (error.message == "The password is invalid or the user does not have a password."){
            error.message = "We cannot find an account with that email address or the password is incorrect."
          }

          this.eventAuthError.next(error);
        })
        .then(userCredential => {
          if(userCredential) {
            this.router.navigate(['/']);
          }
        })
    }

    createUser(user){
      if (user.password != user.passwordconfirm){
        var errorMsg  = 
                     {
                         "code": "auth/password-match",
                         "message": "Passwords do not match."
                     };
        this.eventAuthError.next(errorMsg);
      }
      else if (user.password.length<8){
        var errorMsg  = 
                     {
                         "code": "auth/password-length",
                         "message": "Passwords must be 8 characters or more."
                     };
        this.eventAuthError.next(errorMsg);
      }
      else if (user.name.length==0){
        var errorMsg  = 
                     {
                         "code": "auth/no-name",
                         "message": "Please enter your name."
                     };
        this.eventAuthError.next(errorMsg);
      }
      else{
      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredential => {
        this.newUser = user;

        userCredential.user.updateProfile( {
          displayName: user.name
        });

        this.insertUserData(userCredential)
        .then(()=>{
          this.router.navigate(['']);
      });
    })
    .catch(error=>{
      if (error.message == "The email address is badly formatted."){
        error.message = "Please enter a valid email."
      }
      this.eventAuthError.next(error);
    })
  }
  }

    insertUserData(userCredential: firebase.auth.UserCredential){
      return this.db.doc(`Users/${userCredential.user.uid}`).set({
        email: this.newUser.email,
        name: this.newUser.name,
        role: 'standard'
      })
    }

    logout(){
      return this.afAuth.auth.signOut();
    }
}
