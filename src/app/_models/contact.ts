import {GCNames} from './gcnames';
import {GCPhoneNumbers} from './gcphone-numbers';
import {GCPhoto} from './gcphoto';
import {GCEmail} from './gcemail';
import {GCMembership} from './gcmembership';

export class Contact {
    emailAddresses: GCEmail[];
    memberships: GCMembership[];
    names: GCNames[];
    phoneNumbers: GCPhoneNumbers[];
    photos: GCPhoto[];
    resourceName: string;
}
