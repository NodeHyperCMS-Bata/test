import ejs from "ejs";
import fs from "fs";
import {rootDir, path} from "./path";
import event from "./event";
import multer from 'multer';
import AdmZip from "adm-zip";
import {Router, express} from './router';
import {themeFound, themes, activeTheme} from "./themeRead";
import {pluginFound, plugins, activePlugins} from "./plugin";
import {getSiteInfo, setSiteInfo, getMembers, getMemberNumber, getUserInfo, setUserInfo, tables} from "./site";
import {error} from "./404";
import {getPageUrlsAwait} from './pages';

import reset from "./reset";
import restart from "./restart";
import installPackages from "./installPackages";
import {log, logReset, readHTMLlogs} from "./log";

const router = new Router();

let pageUrls = getPageUrlsAwait();

let themeMenus = [];
let pluginMenus = [];

themeFound();
pluginFound();

const themeUpload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, rootDir('theme'));
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, 'upload_theme_'+new Date().valueOf() + ext);
        },
    }),
	fileFilter(req, file, done){
		const ext = path.extname(file.originalname);
        if(ext === '.zip'){
            done(null, true);
        } else {
            done(null, false);
        }
    },
    limits: {fileSize: 5 * 1024 * 1024},
});

const pluginUpload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, rootDir('plugin'));
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, 'upload_plugin_'+new Date().valueOf() + ext);
        },
    }),
	fileFilter(req, file, done){
		const ext = path.extname(file.originalname);
        if(ext === '.zip'){
            done(null, true);
        } else {
            done(null, false);
        }
    },
    limits: {fileSize: 5 * 1024 * 1024},
});

function basicData(req, res){
    return {req, res, themeMenus, pluginMenus, path};
}

router.admin = (url, ...cb) => {
    let new_cbs = [];
    cb.forEach((el, i) => {
        new_cbs.push((req, res, next) => {
            if(req.session?.isLogined && req?.userInfo?.isadmin){
                return el(req, res, next);
            } else {
                error(req, res);
            }
        });
    });
    router.all(url, ...new_cbs);
};

function render(data, basicdata, page, callback){
    if(fs.existsSync(process.cwd()+'/admin/ejs/'+page+'.ejs')){
        Object.assign(data, {
            title: '',
            mainflex: true,
            defineTitle(title){
                data.title = title;
            },
            defineMainflex(isflex){
                data.mainflex = isflex;
            }
        });
        ejs.renderFile(process.cwd()+'/admin/ejs/'+page+'.ejs', Object.assign(basicdata, data), {}, (err, str) => {
            ejs.renderFile(process.cwd()+'/admin/ejs/layout.ejs', Object.assign(basicdata, {title: data.title, mainflex: data.mainflex, page: str}), {}, function(e, s){
                callback(e, s);
            });
        });
    }
}

function themereload(){
    themeMenus = [];
    if(activeTheme.admin){
        activeTheme.admin.forEach(page => {
            router.admin(path.join('/admin/theme/', activeTheme.dirname, page.url), async (req, res) => {
                await page.routing(req, res, (page) => {
                    return new Promise(async (resolve, reject) => {
                        let data = page.data || {};
                        let basicdata = basicData(req, res);
                        if(fs.existsSync(path.normalize(page.page)+'.ejs')){
                            Object.assign(data, {
                                title: '',
                                mainflex: true,
                                defineTitle: (title) => {
                                    data.title = title;
                                },
                                defineMainflex(isflex){
                                    data.mainflex = isflex;
                                }
                            });
                            ejs.renderFile(page.page+'.ejs', Object.assign(basicdata, data), {}, function(err, str){
                                ejs.renderFile(process.cwd()+'/admin/ejs/layout.ejs', Object.assign(basicdata, {title: data.title, mainflex: data.mainflex, page: str}), {}, function(e, s){
                                    if(e) console.error(e);
                                    res.status(200).send(s);
                                    resolve();
                                });
                            });
                        }
                    });
                });
            });
        });

        if(themeMenus = structuredClone(activeTheme.themeMenu)){
            if(!Array.isArray(themeMenus)) themeMenus = [themeMenus];
        }
    }
}

function pluginreload(){
    pluginMenus = [];
    activePlugins.forEach(plugin => {
        if(plugin.admin){
            plugin.admin.forEach(page => {
                router.admin(path.join('/admin/plugin/', plugin.dirname, page.url), async (req, res) => {
                    await page.routing(req, res, (page) => {
                        return new Promise(async (resolve, reject) => {
                            let data = page.data || {};
                            let basicdata = basicData(req, res);
                            if(fs.existsSync(path.normalize(page.page)+'.ejs')){
                                Object.assign(data, {
                                    title: '',
                                    mainflex: true,
                                    defineTitle: (title) => {
                                        data.title = title;
                                    },
                                    defineMainflex(isflex){
                                        data.mainflex = isflex;
                                    }
                                });
                                ejs.renderFile(page.page+'.ejs', Object.assign(basicdata, data), {}, function(err, str){
                                    ejs.renderFile(process.cwd()+'/admin/ejs/layout.ejs', Object.assign(basicdata, {title: data.title, mainflex: data.mainflex, page: str}), {}, function(e, s){
                                        if(e) console.error(e);
                                        res.status(200).send(s);
                                        resolve();
                                    });
                                });
                            }
                        });
                    });
                });
            });

            let pluginMenu = [];
            if(pluginMenu = structuredClone(plugin.pluginMenu)){
                if(!Array.isArray(pluginMenu)){
                    pluginMenus.push(pluginMenu);
                } else {
                    pluginMenus.push(...pluginMenu);
                }
            }
        }
    });
}

event.on("theme_change", themereload);

themereload();

event.on("plugin_change", pluginreload);

pluginreload();

router.admin('/admin/', async (req, res) => {
    let user5 = [];
    (await getMembers()).sort((a, b) => b.joinDate - a.joinDate).forEach((element, i) => {
        if(i < 5) user5.push(element);
    });

    let data = {user5, isOwner: req.userInfo?.member_number === (await tables.owner.get())};
    render(data, basicData(req, res), 'index', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.admin('/admin/site/BasicPreferences/', async (req, res) => {//await tables.owner.set(0);
    if(req.body.siteName && req.body.siteDescription){
        let siteOwner;
        let isOwner = req.userInfo?.member_number === (await tables.owner.get());
        
        if(req.body.siteName === '') res.msgRedirect(req.originalUrl, {type: 'danger', msg: '사이트 제목은 빈칸일 수 없습니다.'});
        else if(isOwner && (siteOwner = await getMemberNumber(req.body.siteOwner)) === undefined) res.msgRedirect(req.originalUrl, {type: 'danger', msg: `'${req.body.siteOwner}' 사용자가 존재하지 않습니다.`});
        else {
            req.siteInfo.title = req.body.siteName;
            req.siteInfo.description = req.body.siteDescription;

            await setSiteInfo(req.siteInfo);

            if(isOwner){
                await tables.owner.set(siteOwner);

                for(const key in req.body){
                    if(key.startsWith('pageUrls')){
                        const page = key.substring(9);

                        pageUrls[page] = req.body[key];
                    }
                }

                if(JSON.stringify(req.siteInfo.pages) !== JSON.stringify(pageUrls)){
                    req.siteInfo.pages = pageUrls;

                    await setSiteInfo(req.siteInfo);

                    res.msgRedirect('/admin', {type: 'success', msg: `설정 성공! 서버 재시작중...`});

                    restart();

                    return;
                }
            }
            
            res.msgRedirect(req.originalUrl, {type: 'success', msg: `설정 성공!`});
        }
    } else {
        let admins = [];

        (await getMembers()).forEach(el => {
            if(el.isadmin) admins.push(el);
        });

        let data = {
            isowner: req.userInfo?.member_number === (await tables.owner.get()),
            owner: await tables.owner.get(),
            admins,
            pageUrls
        };
        
        render(data, basicData(req, res), 'site/BasicPreferences', (err, str) => {
            if(err) console.error(err);
            res.status(200).send(str);
        });
    }
});

router.admin('/admin/site/menuSettings/', async (req, res) => {
    if(req.body.menus){
        try {
            req.siteInfo.mainMenus = JSON.parse(req.body.menus);
        } catch(err){
            res.msgRedirect(req.originalUrl, {type: 'danger', msg: 'JSON 파싱 오류: '+err});
            return;
        }
        
        await setSiteInfo(req.siteInfo);
            
        res.msgRedirect(req.originalUrl, {type: 'success', msg: `설정 성공!`});
    } else {
        let data = {
            menus: req.siteInfo.mainMenus
        };
        
        render(data, basicData(req, res), 'site/menuSettings', (err, str) => {
            if(err) console.error(err);
            res.status(200).send(str);
        });
    }
});

router.admin('/admin/install', (req, res) => {
    let data = {};
    render(data, basicData(req, res), 'server/install', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.admin('/admin/server/serverSettings/', async (req, res) => {
    if(req.userInfo?.member_number === await tables.owner.get()){
        if(0/*req.body.siteName && req.body.siteDescription*/){
            /*if(req.body.siteName === '') res.msgRedirect(req.originalUrl, {type: 'danger', msg: '사이트 제목은 빈칸일 수 없습니다.'});
            else {
                req.siteInfo.title = req.body.siteName;
                req.siteInfo.description = req.body.siteDescription;

                await setSiteInfo(req.siteInfo);
                
                res.msgRedirect(req.originalUrl, {type: 'success', msg: '설정 성공!'});
            }*/
        } else if(req.query.send === "visitorCount_reset"){
            await tables.visit.set([]);

            res.msgRedirect('/admin/server/serverSettings/', {type: 'success', msg: '접속자 집계가 초기화되었습니다!'});
        } else if(req.query.send === "log_reset"){
            logReset();

            res.msgRedirect('/admin/server/serverSettings/', {type: 'success', msg: '로그가 초기화되었습니다!'});
        } else if(req.query.send === "restart"){
            res.msgRedirect('/admin/server/serverSettings/', {type: 'success', msg: '서버가 재시작되었습니다!'});

            restart();
        } else if(req.query.send === "reset"){
            res.redirect('/admin/install');

            reset();
            restart();
        } else {
            let data = {log: readHTMLlogs()};
            render(data, basicData(req, res), 'server/serverSettings', (err, str) => {
                if(err) console.error(err);
                res.status(200).send(str);
            });
        }
    } else {
        let data = {};
        render(data, basicData(req, res), '403', (err, str) => {
            if(err) console.error(err);
            res.status(403).send(str);
        });
    }
});

router.admin('/admin/member/memberManagement/', async (req, res) => {
    let data = {users: await getMembers(), isOwner: req.userInfo?.member_number === (await tables.owner.get())};
    render(data, basicData(req, res), 'member/memberManagement', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.admin('/admin/member/memberEdit/:memberName', async (req, res) => {
    if(!req.params.memberName || !getUserInfo(req.params.memberName)){
        res.msgRedirect('/admin/member/memberManagement/', {type: 'danger', msg: '존재하지 않는 회원입니다.'});
    } else {
        let isOwner = req.userInfo?.member_number === (await tables.owner.get());

        let data = {
            username: req.params.memberName, 
            memberNumber: await getMemberNumber(req.params.memberName),
            userInfo: new Object(),
            isOwner
        };

        data.userInfo = await getUserInfo(data.memberNumber);
    
        if(req.body.level){
            if(await tables.owner.get() === data.userInfo.member_number) res.msgRedirect(req.originalUrl, {type: 'danger', msg: '주인을 편집할 수는 없습니다.'});
            if(!isOwner && data.userInfo.level >= req.userInfo.level && data.userInfo.isadmin) res.msgRedirect(req.originalUrl, {type: 'danger', msg: '설정하시려는 회원의 레벨이 사용자님의 레벨보다 높거나 같습니다.'});
            else if(!isOwner && +req.body.level > req.userInfo.level) res.msgRedirect(req.originalUrl, {type: 'danger', msg: '설정하시려는 레벨이 사용자님의 레벨보다 높습니다.'});
            else if(+req.body.level < 1) res.msgRedirect(req.originalUrl, {type: 'danger', msg: '레벨은 0 이상이여야 합니다.'});
            else {
                data.userInfo.isadmin = !!req.body.isadmin;
                data.userInfo.level = +req.body.level;
        
                await setUserInfo(data.memberNumber, data.userInfo);
                
                res.msgRedirect(req.originalUrl, {type: 'success', msg: '설정 성공!'});
            }
        } else {
            render(data, basicData(req, res), 'member/memberEdit', (err, str) => {
                if(err) console.error(err);
                res.status(200).send(str);
            });
        }
    }
});

router.admin('/admin/member/visitorCount/', async (req, res) => {
    let visit = await tables.visit.get();
    for(const key in visit){
        visit[key].userInfo = await getUserInfo(visit[key].member);
    }

    let data = {visit};
    render(data, basicData(req, res), 'member/visitorCount', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.admin('/admin/theme-update/themeManager/', (req, res) => {
    let data = {themes};
    render(data, basicData(req, res), 'theme/themeManager', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.admin('/admin/theme-update/themeInstaller/', (req, res) => {
    let data = {themes};
    render(data, basicData(req, res), 'theme/themeInstaller', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.admin('/admin/theme-update/upload/', themeUpload.single('theme'), (req, res) => {
    if(req.file){
        const zip = new AdmZip(req.file.path);
        zip.extractAllTo(rootDir('theme'), true);
        event.emit("theme_change");
        res.msgRedirect('/admin/theme-update/themeInstaller/', {type: 'success', msg: '테마가 추가되었습니다.'});
    } else {
        res.msgRedirect('/admin/theme-update/themeInstaller/', {type: 'danger', msg: '지원되지 않는 테마 파일 형식입니다'});
    }
});

router.admin('/admin/theme-update/active/:themeName', async (req, res) => {
    if(!req.params.themeName || !themes.some(el => el.dirname === req.params.themeName)){
        res.msgRedirect('/admin/theme-update/themeManager/', {type: 'danger', msg: '존재하지 않는 테마입니다.'});
    } else {
        if(activeTheme.dirname === req.params.themeName) res.msgRedirect('/admin/theme-update/themeManager/', {type: 'danger', msg: '이미 활성화되있습니다.'});
        else {
            req.siteInfo.theme = req.params.themeName;
            
            await setSiteInfo(req.siteInfo);

            event.emit("theme_change");

            res.msgRedirect('/admin/theme-update/themeManager/', {type: 'success', msg: '활성화 되었습니다!'});

            restart();
        }
    }
});


router.admin('/admin/plugin-update/pluginManager/', (req, res) => {
    let data = {plugins};
    render(data, basicData(req, res), 'plugin/pluginManager', function(err, str){
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.admin('/admin/plugin-update/toggleState/:pluginname(*)', async (req, res) => {
    let pluginname;
    if(pluginname = req.params?.pluginname){
        let plugin;
        if(plugins.some(element => {
            if(element.dirname === pluginname){
                plugin = element;
                return 1;
            }
            return 0;
        })){
            let state = false;
            if(activePlugins.some(element => element.dirname === pluginname)){
                for(let i = 0; i < req.siteInfo.activePlugins.length; i++){
                    if(req.siteInfo.activePlugins[i] === pluginname){
                        req.siteInfo.activePlugins.splice(i, 1);
                        i--;
                    }
                }
                state = true;
            } else {
                installPackages(plugin.dir);
                req.siteInfo.activePlugins.push(pluginname);
            }

            await setSiteInfo(req.siteInfo);

            event.emit("plugin_change");
            res.msgRedirect('/admin/plugin-update/pluginManager/', {type: 'success', msg: `플러그인이 ${state ? '비' : ''}활성화되었습니다.`});

            restart();
        } else {
            res.msgRedirect('/admin/plugin-update/pluginManager/', {type: 'danger', msg: '정상적인 방식으로 사용해 주세요.'});
        }
    } else {
        res.msgRedirect('/admin/plugin-update/pluginManager/', {type: 'danger', msg: '정상적인 방식으로 사용해 주세요.'});
    }
});

router.admin('/admin/plugin-update/pluginInstaller/', (req, res) => {
    let data = {plugins};
    render(data, basicData(req, res), 'plugin/pluginInstaller', function(err, str){
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.admin('/admin/plugin-update/pluginInstaller/upload/', pluginUpload.single('plugin'), (req, res) => {
  	if(req.file){
        const zip = new AdmZip(req.file.path);
        zip.extractAllTo(rootDir('plugin'), true);
        event.emit("plugin_change");
		res.msgRedirect('/admin/plugin-update/pluginInstaller/', {type: 'success', msg: '플러그인이 추가되었습니다.'});
	} else {
		res.msgRedirect('/admin/plugin-update/pluginInstaller/', {type: 'danger', msg: '지원되지 않는 플러그인 파일 형식입니다'});
	}
});

router.admin('/admin/(*)', (req, res) => {
    let data = {};
    render(data, basicData(req, res), '404', (err, str) => {
        if(err) console.error(err);
        res.status(404).send(str);
    });
});

router.use('/static', express.static(path.join(process.cwd(), 'admin/static')));

export default router;