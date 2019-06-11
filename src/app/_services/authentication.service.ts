import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  login(email: string, password: string) {
    // return this.firebaseAuth.auth
    //     .signInWithEmailAndPassword(email, password);
  }
}
