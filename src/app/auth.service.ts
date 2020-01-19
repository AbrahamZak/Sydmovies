import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private eventAuthError = new BehaviorSubject<string>("");
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
          this.eventAuthError.next(error);
        })
        .then(userCredential => {
          if(userCredential) {
            this.router.navigate(['/']);
          }
        })
    }

    createUser(user){
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
      this.eventAuthError.next(error);
    })
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
