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

  uploadContacts(email: string, file: string) {
    return this.http.get<ResponseContacts>(environment.apiUrl + '/contactsUpload?userEmail=' + email + '&contactsFile=' + file);
  }

  deletePersonFromContacts(userEmail: string, resourceName: string) {
    return this.http.get<ResponseContacts>(environment.apiUrl + '/contactDelete?userEmail=' + userEmail + '&resourceName=' + resourceName);
  }

  deleteAllFromContacts(userEmail: string) {
    return this.http.get<ResponseContacts>(environment.apiUrl + '/contactDeleteAll?userEmail=' + userEmail);
  }
}
