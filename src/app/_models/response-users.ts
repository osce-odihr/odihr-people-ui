import {User} from './user';
import {OrgUnit} from './org-unit';

export class ResponseUsers {
    ok: boolean;
    msg: string;
    date: Date;
    users: User[];
    units: OrgUnit[];
}
