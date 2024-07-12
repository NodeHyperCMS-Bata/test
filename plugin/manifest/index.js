let ejs = require("ejs");
let {posix} = require("path");
let {Router} = require('../../src/router');
let {rootDir} = require("../../src/path");
let {save} = require("../../src/publicValue");
let {getPageUrlsAwait} = require("../../src/pages");

let pageUrls = getPageUrlsAwait();

let router = new Router();

save.save('manifest', '/manifest.json');

function genShortcuts(menus, isLogined, isadmin){
    let shortcuts = [];
	menus.forEach(element => {
		if(element.show == undefined || 
			element.show === 'all' || 
			(element.show === 'signin' && isLogined) || 
			(element.show === 'signout' && !isLogined) || 
			(element.show === 'admin' && isLogined && isadmin)
		){
			if(element.dropdown == undefined){
				if(element.href === '@signin') element.href = pageUrls.signin;
				else if(element.href === '@signup') element.href = pageUrls.signup;
				else if(element.href === '@signout') element.href = pageUrls.signout;
				else if(element.href === '@settings') element.href = pageUrls.settings;
				else element.href = posix.normalize(element.href);
		
				shortcuts.push({name: element.name, url: element.href});
			} else {
				shortcuts.push(...genShortcuts(element.dropdown, isLogined, isadmin));
			}
		}
	});
	return shortcuts;
}

router.all('/manifest.json', (req, res) => {
    res.json({
        short_name: req.siteInfo.title,
        name: req.siteInfo.title,
        background_color: "#ffffff",
        start_url: "/",
        scope: "/",
        //shortcuts: genShortcuts(req.siteInfo.mainMenus, req.session.isLogined, req.userInfo?.isadmin),
        theme_color: "#000000",
        //display_override: ["window-control-overlay", "minimal-ui"],
        display: "standalone",
        description: req.siteInfo.description
    });
});

let adminPages = [];

let pluginMenu = [];

module.exports = {
	adminPages,
	pluginMenu,
	router: [router]
};