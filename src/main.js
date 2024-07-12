import os from "os";
import {app, server} from "./app";
import {colorlog} from "./colorlog";
import {addText, log} from "./log";
import event from "./event";
import ip from "ip";

import api from "./api";
import admin from "./admin";
import theme from "./theme";
import {activePlugins} from "./plugin";
import error from "./404";            

const port = process.env.POST || 3000;

let pluginRouters = [];
let pluginMiddlewares = [];
activePlugins.forEach(plugin => {
    if(plugin.type === 'middleware') pluginMiddlewares.push(plugin);
    else pluginRouters.push(plugin);
});

app.use(admin);

pluginMiddlewares.forEach(plugin => {
    try {
        plugin.router.forEach(router => {
            app.use(router);
        });
    } catch(error){
        log(`An error occurred in middleware plugin ${colorlog.red(plugin.dir)}.\nat ${colorlog.blue(plugin.mainFile)}\nerror: ${colorlog.red(error)}`, 'error');
    }
});

app.use(api);

pluginRouters.forEach(plugin => {
    try {
        plugin.router.forEach(router => {
            app.use(router);
        });
    } catch(error){
        log(`An error occurred in plugin ${colorlog.red(plugin.dir)}.\nat ${colorlog.blue(plugin.mainFile)}\nerror: ${colorlog.red(error)}`, 'error');
    }
});

app.use(theme);

app.use(error);

if(os.type() !== "Linux"){
    log(`os is ${colorlog.red("not")} linux. ${colorlog.red("Errors")} may occur, and some features may ${colorlog.red("not")} work.`, "warning");
}

addText(`\nServer starting...`);
server.listen(port, '0.0.0.0', () => {
    addText(`Server start ${colorlog.green('successfully!')}\n`);
    addText(`${colorlog.green('Ready')} on port ${colorlog.blue(port)}.\n`);
    addText(`Local:            ${colorlog.blue(`http://localhost:${port}`)}`);
    addText(`On Your Network:  ${colorlog.blue(`http://${ip.address()}:${port}`)}`);
}).on('error', err => {
    addText('Error message ' + err);
});