import {User} from './user';

export class ResponseUsers {
    ok: boolean;
    msg: string;
    date: Date;
    feed: User[];
}
