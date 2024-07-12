import {getSiteInfo, getSiteInfoAwait} from './site';

export async function getPageUrls(){
	return await getSiteInfo().pages;
}

export function getPageUrlsAwait(){
	return getSiteInfoAwait().pages;
}