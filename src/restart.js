import exec from "./exec";

import log from "./log";

export function restart(){
    log('Restarting...');
    
    let js_command = process.env.JS_COMMAND || "npm";

    exec(`${js_command} run ${js_command}_restart`, (error, stdout, stderr) => {
        if(error) log('Restart warning, '+error, 'warning');
        if(stderr) log('Restart warning, '+stderr, 'warning');
        
        log('Restart log, '+stdout, 'log');
    });
}

export default restart;