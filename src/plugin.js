import fs from "fs";
import {rootDir, path} from "./path";
import log from "./log";
import {colorlog} from "./colorlog";
import event from "./event";
import {getSiteInfoAwait} from "./site";
import markdown from "./markdown";
import descriptionMarkdown from "./descriptionMarkdown";

export let plugins = [];
export let activePlugins = [];
export let addOns = [];

export function pluginFound(){
	plugins = [];
	activePlugins = [];
    addOns = [];

	let siteInfo = getSiteInfoAwait();
	fs.readdirSync(rootDir('plugin'), {withFileTypes: true}).forEach(file => {
		const dir = file.name;
		if(file.isDirectory()){
			log(`Found plugin ${colorlog.blue(dir)}.`);
			let pluginDir = 'plugin/'+dir, pluginRootDir = rootDir(pluginDir), piuginMainFile, config, configDir;

			if(fs.existsSync(configDir = rootDir(pluginDir, 'package.json'))){
				config = JSON.parse(fs.readFileSync(configDir, "utf8"));
			} else {
				log(`Plugin ${colorlog.yellow(dir)} is missing package.json.`, "warning");
			}

			if(fs.existsSync(piuginMainFile = rootDir(pluginDir, config?.main || 'index.js'))){
				let readme, readmeDir, description, descriptionDir;
				if(fs.existsSync(readmeDir = rootDir(pluginDir, 'readme.md'))){
					readme = fs.readFileSync(readmeDir, "utf8");
				} else {
					log(`Plugin ${colorlog.yellow(dir)} is missing readme.md.`, "warning");
				}

				if(fs.existsSync(descriptionDir = rootDir(pluginDir, 'description.md'))){
					description = fs.readFileSync(descriptionDir, "utf8");
				} else {
					log(`Plugin ${colorlog.yellow(dir)} is missing description.md.`, "warning");
				}

				let pluginData = {
					name: config !== undefined ? config['plugin-name'] || dir : dir,
					dirname: dir,
					type: config['plugin-type'] || 'plugin',
					dir: pluginRootDir,
                    mainFile: piuginMainFile,
					description: description !== undefined ? descriptionMarkdown(description) : undefined,
					readme: readme !== undefined ? markdown(readme) : undefined,
					readmeMd: readme,
					author: config?.author || "",
					version: config?.version,
					active: siteInfo.activePlugins.includes(dir)
				};

                if(pluginData.type === 'add-on') addOns.push(pluginData);
                else {
                    if(pluginData.active){
                        try {
                            let plugin = require(piuginMainFile);
                            activePlugins.push(pluginData = Object.assign(pluginData, {
                                exports: plugin,
                                router: plugin.router,
                                admin: plugin.adminPages,
                                pluginMenu: plugin.pluginMenu
                            }));
                        } catch(error){
                            log(`An error occurred in plugin ${colorlog.red(dir)}.\nat ${colorlog.blue(piuginMainFile)}\nerror: ${colorlog.red(error)}`, 'error');
                            pluginData = null;
                        }					  
                    }
                    if(pluginData) plugins.push(pluginData);
                }
			} else {
				log(`Plugin ${colorlog.red(dir)} does not have ${colorlog.blue(config?.main || 'index.js')}.\nat ${colorlog.blue(rootDir(pluginDir))}`, 'error');
			}
		}
	});

    addOns.forEach(pluginData => {
        if(pluginData.active){
            try {
                let plugin = require(pluginData.mainFile);
                activePlugins.push(pluginData = Object.assign(pluginData, {
                    exports: plugin,
                    router: plugin.router,
                    admin: plugin.adminPages,
                    pluginMenu: plugin.pluginMenu
                }));
            } catch(error){
                log(`An error occurred in plugin ${colorlog.red(pluginData.dir)}.\nat ${colorlog.blue(pluginData.mainFile)}\nerror: ${colorlog.red(error)}`, 'error');
                pluginData = null;
            }					  
        }
        if(pluginData) plugins.push(pluginData);
    });
}
event.on("plugin_change", pluginFound);