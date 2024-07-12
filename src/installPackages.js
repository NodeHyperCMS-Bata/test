import exec from "./exec";

import log from "./log";

export function installPackages(dir){
    log('Install Packages... '+dir);
    
    let js_command = process.env.JS_COMMAND || "npm";

    exec(`cd ${dir} && ${js_command} install`, (error, stdout, stderr) => {
        if(error) log('Install packages warning, '+error, 'warning');
        if(stderr) log('Install packages warning, '+stderr, 'warning');
        
        log(stdout, 'log');
    });
}

export default installPackages;