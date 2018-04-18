import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth'
import * as firebase from "firebase";


@Injectable()
export class AuthenticationProvider {




  constructor(public http: Http, private _ANGFIRE: AngularFireAuth,) {

  }


  loginWithEmailAndPassword(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._ANGFIRE
        .auth
        .signInWithEmailAndPassword(email, password)
        .then((val: any) => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }


  public getUUID(){
    let result:string = firebase.auth().currentUser.uid
    return result;
  }
  logOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._ANGFIRE.auth.signOut()
        .then((data: any) => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }


  signupUser(email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        firebase
          .database()
          .ref('/users/')
          .child(newUser.uid)
          .set(
            {
              email: email,
              uid: newUser.uid
            }
          );
      });
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }


}
