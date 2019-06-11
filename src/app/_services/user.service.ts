import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResponseUsers} from '../_models/response-users';
import {environment} from '../../environments/environment';
import {ResponseContacts} from '../_models/response-contacts';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
      private http: HttpClient
  ) { }

  getUsers() {
    return this.http.get<ResponseUsers>(environment.apiUrl + '/users');
  }

  getContacts(email: string) {
    return this.http.get<ResponseContacts>(environment.apiUrl + '/contacts?userEmail=' + email);
  }

}
