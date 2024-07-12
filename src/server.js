import dotenv from "dotenv";
dotenv.config();

import {existsDatabase, eraseDatabase} from "./database";
import start from "./start";
import {colorlog} from "./colorlog";
import {addText} from "./log";
import kill from "kill-port";
import fs from "fs";

const port = process.env.POST || 3000;

function server(){
	require('./main.js');
}

addText(
    '\n',
    colorlog.blue(   `    _   __          __     __  __                      ________  ________`), '\n',
    colorlog.cyan(   `   / | / /___  ____/ /__  / / / /_  ______  ___  _____/ ____/  |/  / ___/`), '\n',
    colorlog.magenta(`  /  |/ / __ \\/ __  / _ \\/ /_/ / / / / __ \\/ _ \\/ ___/ /   / /|_/ /\\__ \\ `), '\n',
    colorlog.red(    ` / /|  / /_/ / /_/ /  __/ __  / /_/ / /_/ /  __/ /  / /___/ /  / /___/ / `), '\n',
    colorlog.yellow( `/_/ |_/\\____/\\__,_/\\___/_/ /_/\\__, / .___/\\___/_/   \\____/_/  /_//____/  `), '\n',
    colorlog.white(  `                             /____/_/                                    `)
);

addText(`\nServer starting...`);

//eraseDatabase();
addText(`Killing port ${colorlog.blue(port)}...`);

new Promise((resolve, reject) => {
    kill(port, 'tcp').then(() => {
        addText(`Port ${colorlog.blue(port)} kill ${colorlog.green('successfully!')}`);
        resolve("successfully");
    }).catch((err) => {
        if(err.message === 'No process running on port'){
            addText(`${colorlog.green('Ok')}, No process running on port ${colorlog.blue(port)}`);
            resolve("successfully");
        } else {
            addText(`${colorlog.red('Error')} killing port ${colorlog.blue(port)}`);
            addText(`${colorlog.red('Error')}`, err.message);
            resolve(err);
        }
    });
}).then((res) => {
	if(!existsDatabase() || !fs.existsSync(process.cwd()+'/config.js')){
		start().then(() => server());
	} else server();
});