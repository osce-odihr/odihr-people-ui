import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {filter, first} from 'rxjs/operators';
import {AlertService} from '../_services/alert.service';
import {OrgUnit} from '../_models/org-unit';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private loading: boolean;
  private users: User[];
  private units: OrgUnit[];

  constructor(
      private userService: UserService,
      private alertService: AlertService
  ) { }

  ngOnInit() {
    this.userService.getUsers()
        .pipe(first())
        .subscribe(
            apiResponse => {
              if (apiResponse.ok) {
                this.users = apiResponse.users;
                this.units = apiResponse.units;
              } else {
                this.alertService.error(apiResponse.msg);
              }
              this.loading = false;
            },
            error => {
              this.alertService.error(error.statusText);
              this.loading = false;
            });
  }

    private deleteContacts(email: string) {
        alert('ok!');
    }

    private uploadContacts(email: string) {
        alert('ok upload!');
    }

    filterUser(unit: string) {
        const result: User[] = [];

        for (const index in this.users) {
            if (this.users[index].orgUnitPath === unit) {
                result.push(this.users[index]);
            }
        }

        return result;
    }

}
