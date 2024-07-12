import {getSiteInfoAwait} from "./site";

export function themeRequire(file = ''){
    return require('../theme/'+getSiteInfoAwait().theme+file);
}

export default themeRequire;