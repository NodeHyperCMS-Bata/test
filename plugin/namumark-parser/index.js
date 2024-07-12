const Namumark = require('js-namumark');
const {getHook} = require('../../src/hook');
const {HTMLencoding} = require('../../src/plugin/HTMLencoding');

getHook('add_wiki_parser')('Namumark', (req, name, getWikiDoc, rever) => {
    let doc = {};

    doc = {
        exists: (dname) => (getWikiDoc(dname) ? true : false),
        read: (dname) => {
            if (rever !== undefined && dname === name) return getWikiDoc(name)?.revers[rever - 1]?.contents || '';
            return getWikiDoc(name)?.contents || '';
        },
    };

    return new Promise((res, rej) => {
        let namumark = new Namumark(name, {
            wiki: doc,
        });

        namumark.setRenderer(null, {includeParserOptions: {wiki: doc}});
        namumark.parse((err, renderResults) => {
            if (err) {
                rej(err.message, err.stack);
                return;
            }
            if (renderResults.redirect) res({html: '', categories: [], redirect: renderResults.redirect});

            let html = renderResults.html;

            html = html.replace(/{id}/gi, req.userInfo?.username || req.ip);
            html = html.replace(/{ip}/gi, req.ip);
            html = HTMLencoding(html);

            let categories = renderResults.categories;

            res({html, categories});
        });
    });
});

let adminPages = [];

let pluginMenu = [];

module.exports = {
    adminPages,
    pluginMenu,
    router: [],
};
