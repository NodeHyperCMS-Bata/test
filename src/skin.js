import {getPageUrlsAwait} from './pages';

let skin = {};

let pageUrls = getPageUrlsAwait();


export function addSkin(skins){
	
	skin.push(...skins)
}

/*router.receive(pageUrls.settings, (req, res) => {
    (pages?.settings || error)(req, res);
});*/