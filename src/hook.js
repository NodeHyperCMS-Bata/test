export let hooks = {};

export function addHook(name, cb){
    hooks[name] = cb;
}

export function getHook(name){
    return hooks[name];
}

export function replaceHook(name, cb){
    hooks[name] = cb;
}