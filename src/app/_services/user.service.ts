import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResponseUsers} from '../_models/response-users';
import {environment} from '../../environments/environment';

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

}
