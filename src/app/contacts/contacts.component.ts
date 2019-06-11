import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import {Contact} from '../_models/contact';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  private loading: boolean;
  private userEmail: string;
  private contacts: Contact[];

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
      private alertService: AlertService
  ) { }

  ngOnInit() {
    this.userEmail = this.route.snapshot.queryParams.userEmail;
    if (this.userEmail == null) {
      this.router.navigate(['/home']);
    }

    this.loading = true;

    this.userService.getContacts(this.userEmail)
        .pipe(first())
        .subscribe(
            apiResponse => {
              if (apiResponse.ok) {
                this.contacts = apiResponse.contacts;
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

}
