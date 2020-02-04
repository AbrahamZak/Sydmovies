//All services related to authentication

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Handle error messages as observables
  private eventAuthErrorLogin = new BehaviorSubject<any>("");
  private eventAuthErrorSignUp = new BehaviorSubject<any>("");
  private eventAuthErrorReset = new BehaviorSubject<any>("");
  private eventAuthErrorChange = new BehaviorSubject<any>("");
  eventAuthErrorLogin$ = this.eventAuthErrorLogin.asObservable();
  eventAuthErrorSignUp$ = this.eventAuthErrorSignUp.asObservable();
  eventAuthErrorReset$ = this.eventAuthErrorReset.asObservable();
  eventAuthErrorChange$ = this.eventAuthErrorChange.asObservable();

  newUser: any;
  credential: any;

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router) { }

    //Get the user state
    getUserState(){
      return this.afAuth.authState;
    }

    //Login with provided email and password, return error if unsuccessful
    login( email: string, password: string) {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
          if (error.message == "The email address is badly formatted."){
            error.message = "Please enter a valid email."
          }
          else if (error.message == "The password is invalid or the user does not have a password."){
            error.message = "We cannot find an account with that email address or the password is incorrect."
          }
          else if (error.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
            error.message = "We cannot find an account with that email address or the password is incorrect."
          }

          this.eventAuthErrorLogin.next(error);
        })
        .then(userCredential => {
          if(userCredential) {
            //Once successful navigate to home
            this.router.navigate(['/']);
          }
        })
    }

    //Change the user's password provided with the user info, current password, and the new password
    changePassword(user, currentPassword, passwordChange, passwordChangeConfirm){
      var success = false;
      //Return an error if the new password and confirm password don't match
      if (passwordChange!=passwordChangeConfirm){
        var errorMsg  = 
                     {
                         "code": "auth/password-match",
                         "message": "Passwords do not match."
                     };
        this.eventAuthErrorChange.next(errorMsg);
      }
      //Return error if length is less than 8
      else if (passwordChange.length<8){
        var errorMsg  = 
                     {
                      "code": "auth/password-length",
                      "message": "Passwords must be 8 characters or more."
                     };
        this.eventAuthErrorChange.next(errorMsg);
      }
      else{
        //Create a new credential with provided original password
        this.credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        success = user.reauthenticateWithCredential(this.credential).then(function() {
          //Update the password, catch any errors
          return user.updatePassword(passwordChange).then(function() {
            return true;
          }).catch(error=>{
            this.eventAuthErrorChange.next(error);
            return false;
          });
        }).catch(error=>{
          if (error.message == "The password is invalid or the user does not have a password."){
            error.message = "Current password entered is incorrect."
          }
          this.eventAuthErrorChange.next(error);
        });
      }
      return success;
    }

    //Reset the user's password with their provided account email, catch and returns any errors
    resetPassword(email: string) {
      return this.afAuth.auth.sendPasswordResetEmail(email).then(function(){
         return true;
      }).catch(error=>{
        if (error.message == "The email address is badly formatted."){
          error.message = "Please enter a valid email."
        }
        else if (error.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
          error.message = "We couldn't find a user for that email."
        }
         this.eventAuthErrorReset.next(error);
         return false;
       });
   }

   //Create a new user
    createUser(user){
      //Check if the password matches the confirm
      if (user.password != user.passwordconfirm){
        var errorMsg  = 
                     {
                         "code": "auth/password-match",
                         "message": "Passwords do not match."
                     };
        this.eventAuthErrorSignUp.next(errorMsg);
      }
      //Check if length is less than 8
      else if (user.password.length<8){
        var errorMsg  = 
                     {
                         "code": "auth/password-length",
                         "message": "Passwords must be 8 characters or more."
                     };
        this.eventAuthErrorSignUp.next(errorMsg);
      }
      //Check if user name was provided
      else if (user.name.length==0){
        var errorMsg  = 
                     {
                         "code": "auth/no-name",
                         "message": "Please enter your name."
                     };
        this.eventAuthErrorSignUp.next(errorMsg);
      }
      else{
        //Create the account and/or return any errors
      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredential => {
        this.newUser = user;

        userCredential.user.updateProfile( {
        displayName: user.name
        });

        //Insert new user into the db and navigate to homepage
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

  //Inserts the user data into the database with their credential
    insertUserData(userCredential: firebase.auth.UserCredential){
      return this.db.doc(`Users/${userCredential.user.uid}`).set({
        email: this.newUser.email,
        name: this.newUser.name,
        role: 'standard'
      })
    }

    //Logout the user
    logout(){
      return this.afAuth.auth.signOut();
    }
}
