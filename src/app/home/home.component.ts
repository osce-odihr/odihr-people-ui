import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {filter, first} from 'rxjs/operators';
import {AlertService} from '../_services/alert.service';
import {OrgUnit} from '../_models/org-unit';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    loading = false;
    submitted = false;
    users: User[];
    units: OrgUnit[];
    contactsMassUploadForm: FormGroup;
    uploadEmails: string[];
    uploadEmailIndex: number;
    uploadLog = '';

    constructor(
        @Inject(DOCUMENT) document,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.loading = true;

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

        this.contactsMassUploadForm = this.formBuilder.group({
            orgUnit: ['/', [Validators.required]],
            contactsFileUrl: ['', [Validators.required]],
        });
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.contactsMassUploadForm.invalid) {
            return;
        }

        this.loading = true;
        this.uploadEmails = [];

        const elements = document.getElementsByName('massUploadUser');
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < elements.length; i++) {
            // @ts-ignore
            if (elements[i].type === 'checkbox') {
                // @ts-ignore
                if (elements[i].checked) {
                    // @ts-ignore
                    const userEmail = elements[i].value;

                    this.uploadEmails.push(userEmail);
                }
            }
        }
        this.uploadEmailIndex = 0;

        this.uploadContactsNextUser();
    }

    uploadContactsNextUser() {
        this.displayUploadContactsStatus();

        const email = this.uploadEmails[this.uploadEmailIndex++];

        if (email === null) {
            this.loading = false;
            return null;
        }

        this.userService.uploadContacts(email, this.contactsMassUploadForm.controls.contactsFileUrl.value)
            .pipe(first())
            .subscribe(
                apiResponse => {
                    this.uploadContactsNextUser();
                },
                error => {
                    this.loading = false;
                });
    }

    displayUploadContactsStatus() {
        let log = '';

        // tslint:disable-next-line:forin
        for (const indexString in this.uploadEmails) {
            const index = Number(indexString);

            if (index < this.uploadEmailIndex) {
                log += this.uploadEmails[index] + '..DONE! ';
            } else if (index === this.uploadEmailIndex) {
                log += this.uploadEmails[index] + '..LOADING ';
            } else {
                log += this.uploadEmails[index] + '..waiting.. ';
            }
        }

        this.uploadLog = log;
    }

    selectAllCheckbox(unit: string) {
        console.log('Select all: ' + unit);

        // tslint:disable-next-line:forin
        for (const index in this.users) {
            const checkbox = document.getElementById('user-' + this.users[index].primaryEmail);

            if (this.users[index].orgUnitPath === unit) {
                checkbox.setAttribute('checked', 'checked');
            } else {
                checkbox.removeAttribute('checked');
            }
        }
    }

    deselectAllCheckbox() {
        console.log('deselectAllCheckbox all');

        // tslint:disable-next-line:forin
        for (const index in this.users) {
            const checkbox = document.getElementById('user-' + this.users[index].primaryEmail);
            checkbox.removeAttribute('checked');
        }
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
