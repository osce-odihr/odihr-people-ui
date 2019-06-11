import {Contact} from './contact';
import {ContactGroup} from './contact-group';

export class ResponseContacts {
    ok: boolean;
    msg: string;
    date: Date;
    contacts: Contact[];
    contactGroups: ContactGroup[];
}
