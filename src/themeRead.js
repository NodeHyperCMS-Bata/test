import fs from "fs";
import {rootDir, path} from "./path";
import log from "./log";
import {colorlog} from "./colorlog";
import event from "./event";
import {getSiteInfoAwait} from "./site";
import markdown from "./markdown";

export let themes = [];
export let themeMenu = [];
export let activeTheme = new Object();

export function themeFound(){
	themes = [];
	themeMenu = [];

	let siteInfo = getSiteInfoAwait();
	fs.readdirSync(rootDir('theme'), {withFileTypes: true}).forEach(file => {
		const dir = file.name;
		if(file.isDirectory()){
			log(`Found theme ${colorlog.blue(dir)}.`);
			let themeDir = 'theme/'+dir, themeRootDir = rootDir(themeDir), themeMainFile, config, configDir, screenshot, screenshotDir;

			if(fs.existsSync(configDir = rootDir(themeDir, 'package.json'))){
				config = JSON.parse(fs.readFileSync(configDir, "utf8"));
			} else {
				log(`Theme ${colorlog.yellow(dir)} is missing package.json.`, "warning");
			}

			if(fs.existsSync(themeMainFile = rootDir(themeDir, config?.main || 'index.js'))){
				let readme, readmeDir;
				if(fs.existsSync(readmeDir = rootDir(themeDir, 'readme.md'))){
					readme = fs.readFileSync(readmeDir, "utf8");
				} else {
					log(`Theme ${colorlog.yellow(dir)} is missing readme.md.`, "warning");
				}

				if(fs.existsSync(screenshotDir = rootDir(themeDir, 'screenshot.jpg'))){
					try {
						screenshot = Buffer.from(fs.readFileSync(screenshotDir)).toString('base64');
					} catch(err){
						log(`There is a problem reading screenshot.jpg of theme ${colorlog.yellow(dir)}.`, "warning");
					}
				} else {
					log(`Theme ${colorlog.yellow(dir)} is missing screenshot.jpg.`, "warning");
				}

				let themeData = {
					name: config !== undefined ? config['theme-name'] || dir : dir,
					dirname: dir,
					dir: themeRootDir,
					readme: readme !== undefined ? markdown(readme) : undefined,
					readmeMd: readme,
					author: config?.author || "",
					version: config?.version || "1.0.0",
					screenshot,
					active: siteInfo.theme === dir
				};

				if(themeData.active){
					try {
						let theme = require(themeMainFile);
						themeData = Object.assign(themeData, {
							exports: theme,
							router: theme.router,
							admin: theme.adminPages,
							themeMenu: theme.themeMenu
						});

                        activeTheme = themeData;
					} catch(error){
						log(`An error occurred in theme ${colorlog.red(dir)}.\nat ${colorlog.blue(themeMainFile)}\nerror: ${colorlog.red(error)}`, 'error');
						themeData = null;
					}					  
				}
				if(themeData) themes.push(themeData);
			} else {
				log(`Theme ${colorlog.red(dir)} does not have ${colorlog.blue(config?.main || 'index.js')}.\nat ${colorlog.blue(rootDir(themeDir))}`, 'error');
			}
		}
	});
}

event.on("theme_change", themeFound);