import {Router} from './router';

import themeRequire from './themeRequire.js';

const router = new Router();

const theme = themeRequire();

router.all('*', (req, res) => {
    return error(req, res);
});

export let error = theme.error;

export default router;