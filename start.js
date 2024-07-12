require("dotenv").config();

const child = require("child_process");
const sys = require("sys");

let js_command = process.env.JS_COMMAND || "npm";

let status = '';

if(process.argv[2] === 'restart') status = 'restart';
if(process.argv[2] === 'stop') status = 'stop';
else status = 'start';

if(js_command !== "npm" && js_command !== "bun"){
	throw "This js command is not supported.";
}

child.exec(`${js_command} run ${js_command}_${status}`, (error, stdout, stderr) => {
	console.log(stdout);
});