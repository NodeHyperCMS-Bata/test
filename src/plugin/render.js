import {themeRequire} from '../themeRequire';
import {rootDir} from "../path";

let theme = themeRequire();

export class PluginRender {
    constructor(dir){
        this.dir = dir;
    }
    render(data, req, res, file, cb){
        theme.render(data, theme.basicData(req, res), rootDir(this.dir, file), (err, str) => {
            cb(err, str);
        });
    }
};

export default PluginRender;