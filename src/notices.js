import {io} from './app';
import {tables} from './site';

export class Notice {
    constructor(){
        this.notices = {};
    }
    async getNotices(){
        this.notices = await tables.notices.get();

        return this.notices;
    }
    async saveNotices(){
        await tables.notices.set(this.notices);
        
        return this.notices;
    }
    addNotices(user, type, ...notices){
        if(!this.notices[user]) this.notices[user] = {[type]: []};
        else if(!this.notices[user][type]) this.notices[user][type] = [];

        this.notices[user][type].push(...notices);
        io.to(user).emit('update-notices', this.notices[user]);
    }
}

export function updateNotices(req){

}