import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import {Contact} from '../_models/contact';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  private contactsUploadForm: FormGroup;
  private loading = false;
  private submitted = false;
  private userEmail: string;
  private contacts: Contact[];

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
