import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import {Contact} from '../_models/contact';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactGroup} from '../_models/contact-group';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contactsUploadForm: FormGroup;
  loading = false;
  submitted = false;
  userEmail: string;
  contacts: Contact[];
  contactGroups: ContactGroup[];
  contactGroupsIndex: Map<string, string>;

  constructor(
      private formBuilder: FormBuilder,
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

    this.contactsUploadForm = this.formBuilder.group({
      contactsFileUrl: ['', [Validators.required]],
    });

    this.loading = true;

    this.userService.getContacts(this.userEmail)
        .pipe(first())
        .subscribe(
            apiResponse => {
              if (apiResponse.ok) {
                this.contacts = apiResponse.contacts;
                this.contactGroups = apiResponse.contactGroups;

                this.contactGroupsIndex = new Map<string, string>();
                this.contactGroups.forEach(
                  (group) => {
                    this.contactGroupsIndex.set(group.resourceName, group.formattedName);
                  }
                 );
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

  getGroupName(resourceName: string) {
      return this.contactGroupsIndex.get(resourceName);
  }


    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.contactsUploadForm.invalid) {
            return;
        }

        this.loading = true;

        this.userService.uploadContacts(this.userEmail, this.contactsUploadForm.controls.contactsFileUrl.value)
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
