import {OrgUnit} from './org-unit';

export class ResponseOrgUnits {
    ok: boolean;
    msg: string;
    date: Date;
    units: OrgUnit[];
}

