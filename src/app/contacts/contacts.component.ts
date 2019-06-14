import {Component, OnInit} from '@angular/core';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import {Contact} from '../_models/contact';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactGroup} from '../_models/contact-group';
import {ResponseContacts} from '../_models/response-contacts';
import {User} from '../_models/user';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
    contactsUploadForm: FormGroup;
    loading = false;
    loadingDeleteAll = false;
    loadingDelete: string;
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
    ) {
    }

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
                        this.loadContactsResponse(apiResponse);
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

    filterEmptyGroup() {
        const result: ContactGroup[] = [];

        for (const index in this.contactGroups) {
            if (this.contactGroups[index].memberCount > 0) {
                result.push(this.contactGroups[index]);
            }
        }

        return result;
    }

    isManagedGroup(groupName: string): boolean {
        if (groupName === 'National Staff' || groupName === 'Core team' || groupName === 'LTOs') {
            return true;
        } else {
            return false;
        }
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
                        this.loadContactsResponse(apiResponse);
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


    deleteALLFromContacts(userEmail: string) {
        this.loadingDeleteAll = true;

        this.userService.deleteAllFromContacts(userEmail)
            .pipe(first())
            .subscribe(
                apiResponse => {
                    if (apiResponse.ok) {
                        this.loadContactsResponse(apiResponse);
                    } else {
                        this.alertService.error(apiResponse.msg);
                    }
                    this.loadingDeleteAll = false;
                },
                error => {
                    this.alertService.error(error.statusText);

                    this.loadingDeleteAll = false;
                });
    }

    deletePersonFromContacts(userEmail: string, resourceName: string) {
        this.loadingDelete = resourceName;

        this.userService.deletePersonFromContacts(userEmail, resourceName)
            .pipe(first())
            .subscribe(
                apiResponse => {
                    if (apiResponse.ok) {
                        this.loadContactsResponse(apiResponse);
                    } else {
                        this.alertService.error(apiResponse.msg);
                    }
                    this.loadingDelete = null;
                },
                error => {
                    this.alertService.error(error.statusText);
                    this.loadingDelete = null;
                });
    }

    private loadContactsResponse(apiResponse: ResponseContacts) {
        this.contacts = apiResponse.contacts;
        this.contactGroups = apiResponse.contactGroups;

        this.contactGroupsIndex = new Map<string, string>();
        this.contactGroups.forEach(
            (group) => {
                this.contactGroupsIndex.set(group.resourceName, group.formattedName);
            }
        );
    }

}
