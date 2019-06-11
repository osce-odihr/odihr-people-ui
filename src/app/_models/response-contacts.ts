import {Contact} from './contact';

export class ResponseContacts {
    ok: boolean;
    msg: string;
    date: Date;
    contacts: Contact[];
}
