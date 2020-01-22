import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private eventAuthErrorLogin = new BehaviorSubject<any>("");
  private eventAuthErrorSignUp = new BehaviorSubject<any>("");
  private eventAuthErrorReset = new BehaviorSubject<any>("");
  eventAuthErrorLogin$ = this.eventAuthErrorLogin.asObservable();
  eventAuthErrorSignUp$ = this.eventAuthErrorSignUp.asObservable();
  eventAuthErrorReset$ = this.eventAuthErrorReset.asObservable();

  newUser: any;
  credential: any;

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

          this.eventAuthErrorLogin.next(error);
        })
        .then(userCredential => {
          if(userCredential) {
            this.router.navigate(['/']);
          }
        })
    }

    changePassword(user, currentPassword, passwordChange, passwordChangeConfirm){
      var success = false;
      if (passwordChange!=passwordChangeConfirm){
        var errorMsg  = 
                     {
                         "code": "auth/password-match",
                         "message": "Passwords do not match."
                     };
        this.eventAuthErrorReset.next(errorMsg);
      }
      else if (passwordChange.length<8){
        var errorMsg  = 
                     {
                      "code": "auth/password-length",
                      "message": "Passwords must be 8 characters or more."
                     };
        this.eventAuthErrorReset.next(errorMsg);
      }
      else{
        this.credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        success = user.reauthenticateWithCredential(this.credential).then(function() {
          return user.updatePassword(passwordChange).then(function() {
            return true;
          }).catch(error=>{
            this.eventAuthErrorReset.next(error);
            return false;
          });
        }).catch(error=>{
          if (error.message == "The password is invalid or the user does not have a password."){
            error.message = "Current password entered is incorrect."
          }
          this.eventAuthErrorReset.next(error);
        });
      }
      return success;
    }
  

    createUser(user){
      if (user.password != user.passwordconfirm){
        var errorMsg  = 
                     {
                         "code": "auth/password-match",
                         "message": "Passwords do not match."
                     };
        this.eventAuthErrorSignUp.next(errorMsg);
      }
      else if (user.password.length<8){
        var errorMsg  = 
                     {
                         "code": "auth/password-length",
                         "message": "Passwords must be 8 characters or more."
                     };
        this.eventAuthErrorSignUp.next(errorMsg);
      }
      else if (user.name.length==0){
        var errorMsg  = 
                     {
                         "code": "auth/no-name",
                         "message": "Please enter your name."
                     };
        this.eventAuthErrorSignUp.next(errorMsg);
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
      this.eventAuthErrorSignUp.next(error);
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
