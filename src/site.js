import {Database} from "./database";
import {password_hash} from "./password";

export let DBs = {
    site: new Database('site')
};

export let tables = {
    members: DBs.site.table('members'),
    member_names: DBs.site.table('member_names'),
    member_number: DBs.site.table('member_number'),
    site: DBs.site.table('site'),
    owner: DBs.site.table('owner'),
    visit: DBs.site.table('visit'),
    notices: DBs.site.table('notices')
};

export async function getMemberNumber(user){
    return (await tables.member_names.get())[user];
}

export async function getUserInfo(member_number){
    return (await tables.members.get())[member_number];
}

export async function setMemberNumber(user, member_number){
    let memberNames = await tables.member_names.get();
    memberNames[user] = member_number;
    await tables.member_names.set(memberNames);
}

export async function setUserInfo(member_number, userInfo){
    let userInfos = await tables.members.get();
    userInfos[member_number] = userInfo;
    await tables.members.set(userInfos);
}

export async function changeUserName(oldusername, newusername){
    let memberNames = await tables.member_names.get();
    let member_number = memberNames[oldusername];
    delete memberNames[oldusername];
    memberNames[newusername] = member_number;
    await tables.member_names.set(memberNames);

    let userInfos = await tables.members.get();
    userInfos[member_number].username = newusername;
    await tables.members.set(userInfos);
}

export async function addMember(username, password, level, isadmin){
    let member_number = await tables.member_number.get();
    if(isNaN(+member_number)) member_number = 0;
    await tables.member_number.set(member_number+1);

    let userInfo = Object.assign(
		await password_hash(password), 
		{member_number, username, level, isadmin, joinDate: new Date().getTime()}
	);

    await setUserInfo(member_number, userInfo);

	await setMemberNumber(username, member_number);

    return userInfo;
}

export async function changeMemberData(userInfo, {password = null, level = null, isadmin = null}){
	let newData = {};
	if(password){
		newData = Object.assign(newData, await password_hash(password));
	}
	if(level){
		newData = Object.assign(newData, {level});
	}
	if(isadmin){
		newData = Object.assign(newData, {isadmin});
	}

	return Object.assign(userInfo, newData);
}

export async function getMembers(){
    return await tables.members.get();
}

export async function getFindTableDataByMemberNumber(member_number, table){
    return (await table.get())[member_number];
}

export async function getSiteInfo(){
    return await tables.site.get();
}

export async function setSiteInfo(siteInfo){
    await tables.site.set(siteInfo);
}

export function getUserInfoAwait(member_number){
    return (tables.members.getSync())[member_number];
}

export function getSiteInfoAwait(){
    return tables.site.getSync();
}

export function setSiteInfoAwait(siteInfo){
    tables.site.setSync(siteInfo);
}