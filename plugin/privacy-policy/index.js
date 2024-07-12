let ejs = require("ejs");
let {Router} = require('../../src/router');
let {replaceHook, getHook} = require("../../src/hook");
let {getPageUrlsAwait} = require("../../src/pages");
const {PluginRender} = require("../../src/plugin/render");
const {setSiteInfo, getSiteInfoAwait, setSiteInfoAwait} = require("../../src/site");
let {rootDir} = require("../../src/path");

let router = new Router();

let render = new PluginRender('/plugin/privacy-policy/ejs/');

if(!getSiteInfoAwait().privacyPolicyConfig){
    let siteInfo = getSiteInfoAwait();
    siteInfo.privacyPolicyConfig = {
        privacyPolicy: '개인정보처리방침'
    };
    setSiteInfoAwait(siteInfo);
}

router.all('/privacy-policy', (req, res) => {
    render.render({privacyPolicy: req.siteInfo.privacyPolicyConfig.privacyPolicy}, req, res, 'privacy-policy', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

replaceHook('signup_form_bottom', (req, res) => {
	return `
	<small>
		<b>
			가입 버튼을 누른다면 <a href="/privacy-policy">개인정보처리방침</a>에 동의한 것으로 간주합니다.
		</b>
	</small>`;
});

getHook('add_footer_link')('개인정보처리방침', '/privacy-policy');

let adminPages = [
	{
        url: 'settings', 
        async routing(req, res, render){
            if(req.body.privacyPolicy){
                req.siteInfo.privacyPolicyConfig.privacyPolicy = req.body.privacyPolicy;
                await setSiteInfo(req.siteInfo);

                res.msgRedirect('/admin/plugin/privacy-policy/settings', {type: 'success', msg: '성공적으로 개인정보처리방침 설정이 수정되었습니다!'});
            } else {
                await render({
                    data: {privacyPolicyConfig: req.siteInfo.privacyPolicyConfig},
                    page: rootDir("/plugin/privacy-policy", 'admin/index')
                });
            }
        }
    }
];

let pluginMenu = [
	{name: '개인정보처리방침 설정', icon: "fas fa-gear", href: "/plugin/privacy-policy/settings", icon: "fas fa-gear"}
];

module.exports = {
	adminPages,
	pluginMenu,
	router: [router]
};