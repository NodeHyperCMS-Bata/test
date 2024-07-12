import {colorlog} from "./colorlog";

import fs from "fs";
import Convert from "ansi-to-html";

let convert = new Convert({
	fg: '#FFF', 
    bg: '#000'
});

const file = process.cwd() + '/log.log';

if(!fs.existsSync(file)){
	fs.writeFileSync(file, '', 'utf8');
}

export function logReset(){
	return fs.writeFileSync(file, '', 'utf8');
}

export function readLogs(){
	return fs.readFileSync(file, 'utf8');
}

export function readHTMLlogs(){
	return convert.toHtml(readLogs());
}

export function addText(...log){
	let str = log.join(' ');

    console.log(str);

	let logs = readLogs();
	logs += str;
	logs += '\n';
	fs.writeFileSync(file, logs, 'utf8');
}

export function log(log, mode = 'log'){
    let isdev = (process.env.MODE || "dev") == "dev";
	switch(mode){
		case "log":
			if(isdev) addText(`${colorlog.cyan('[log]')} ${log}`);
			break;
		
		case "error":
			addText(`${colorlog.red('[error]')} ${log}`);
			break;

		case "warning":
			if(isdev) addText(`${colorlog.yellow('[warning]')} ${log}`);
			break;
		
		default:
			if(isdev) addText(`${colorlog.cyan('[log]')} ${log}`);
			break;
	}
}

export default log;