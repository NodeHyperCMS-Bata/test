const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const {save} = require("../../src/publicValue");
const {rootDir} = require("../../src/path");
const {getPageUrlsAwait} = require("../../src/pages");
const {getSiteInfoAwait, setSiteInfoAwait, setSiteInfo} = require("../../src/site");
const {addHook, getHook} = require("../../src/hook");

let pageUrls = getPageUrlsAwait();

if(!getSiteInfoAwait().themeConfig){
    let siteInfo = getSiteInfoAwait();
    siteInfo.themeConfig = {
        mode: true
    };
    setSiteInfoAwait(siteInfo);
}

let footerLinks = [];
let footerIcons = [];

addHook('add_footer_link', (name, link) => {
    footerLinks.push({name, link});
});

addHook('add_footer_icon', (html) => {
    footerIcons.push({html});
});

function basicData(req, res){
    let manifest = req.siteInfo.activePlugins.includes('manifest') ? save.load('manifest') : null;
    return {req, res, path, msg: req.msg, pageUrls, manifest, footerLinks, footerIcons};
}

addHook('page_layout_sidemenu', (req, res) => {
    return 'hi?';
});

function render(data, basicdata, page, callback){
    if(fs.existsSync(page+'.ejs')){
        Object.assign(data, {
            title: '',
            css: [],
            js: [],
            defineTitle: (title) => {
                data.title = title;
            },
            addCSS: (css) => {
                data.css.push(`<style>${css}</style>`);
            },
            addJS: (js) => {
                data.js.push(`<script>${js}</script>`);
            },
            addCSSlink: (link) => {
                data.css.push(`<link href="${link}" rel="stylesheet" />`);
            },
            addJSlink: (link) => {
                data.js.push(`<script src="${link}"></script>`);
            }
        });
        ejs.renderFile(page+'.ejs', Object.assign(basicdata, data), {}, function(err, str){
            ejs.renderFile(__dirname+'/ejs/layout.ejs', Object.assign(basicdata, {title: data.title, css: data.css, js: data.js, page: str}), {}, function(e, s){
                callback(e, s);
            });
        });
    }
}

addHook('main_page', (req, res) => {
    return `<h1 class="h2">Hi? ${req.userName}</h1>`;
});

addHook('signup_form_bottom', (req, res) => {
    return ``;
});

let pages = {
    home: (req, res) => {
        let data = {mainPage: getHook('main_page')(req, res)};
        render(data, basicData(req, res), __dirname+'/ejs/index', function(err, str){
            if(err) console.error(err);
            res.status(200).send(str);
        });
    },
    signin: (req, res) => {
        let data = {};
        if(req.session?.isLogined) res.msgRedirect('/', {type: 'danger', msg: '이미 로그인되어 있습니다.'});
        else render(data, basicData(req, res), __dirname+'/ejs/signin', function(err, str){
            if(err) console.error(err);
            res.status(200).send(str);
        });
    },
    signup: (req, res) => {
        let data = {error, signup_form_bottom: getHook('signup_form_bottom')(req, res)};
        if(req.session?.isLogined) res.msgRedirect('/', {type: 'danger', msg: '이미 로그인되어 있습니다.'});
        else render(data, basicData(req, res), __dirname+'/ejs/signup', function(err, str){
            if(err) console.error(err);
            res.status(200).send(str);
        });
    },
    settings: (req, res) => {
        let data = {error};
        if(!req.session?.isLogined) res.msgRedirect('/', {type: 'danger', msg: '로그인 되어있지 않습니다.'});
        else render(data, basicData(req, res), __dirname+'/ejs/settings', function(err, str){
            if(err) console.error(err);
            res.status(200).send(str);
        });
    }
}

function error(req, res){
    let data = {};
    render(data, basicData(req, res), __dirname+'/ejs/404', function(err, str){
        if(err) console.error(err);
        res.status(404).send(str);
    });
}

let themePath = '/theme/basic';

let adminPages = [
	{
        url: 'settings', 
        async routing(req, res, render){
            if(req.body.mode){
                req.siteInfo.themeConfig.mode = req.body.mode === 'light' ? 'light' : 'dark';
                await setSiteInfo(req.siteInfo);

                res.msgRedirect('/admin/theme/basic/settings', {type: 'success', msg: '성공적으로 테마 설정이 수정되었습니다!'});
            } else {
                await render({
                    page: rootDir(themePath, 'admin/index')
                });
            }
        }
    }
];

let themeMenu = [
	{name: '테마 설정', icon: "fas fa-gear", href: "/theme/basic/settings", icon: "fas fa-gear"}
];

module.exports = {
    basicData,
    render,
    pages,
    error,
	adminPages,
	themeMenu
}