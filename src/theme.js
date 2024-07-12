import {Router, express} from './router';
import {activeTheme} from './themeRead';
import {getPageUrlsAwait} from './pages';
import themeRequire from './themeRequire';
import error from "./404";

const router = new Router();

let pageUrls = getPageUrlsAwait();
let {pages} = themeRequire();

router.receive('/', (req, res) => {
    (pages?.home || error)(req, res);
});

router.receive(pageUrls.signin, (req, res) => {
    (pages?.signin || error)(req, res);
});

router.receive(pageUrls.signup, (req, res) => {
    (pages?.signup || error)(req, res);
});

router.receive(pageUrls.settings, (req, res) => {
    (pages?.settings || error)(req, res);
});

router.use('/static', express.static(activeTheme.dir + '/static'));

export default router;