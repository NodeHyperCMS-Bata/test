const Parser = require("./parser");
const toHTML = require("./toHTML");
const {getHook} = require("../../src/hook");
const {HTMLencoding} = require("../../src/plugin/HTMLencoding");

const parser = Parser();

getHook('add_wiki_parser')('Mymark', async (req, name, getWikiDoc, rever) => {
    const contents = rever !== undefined ? getWikiDoc(name)?.revers[rever-1]?.contents || '' : getWikiDoc(name)?.contents || '';
        
    const parse = parser(contents);
    const encoded = toHTML(parse);

    if(encoded.redirect) return {html: '', categories: [], redirect: encoded.redirect};

    let html = encoded.html;

    html = html.replace(/{id}/gi, req.userInfo?.username || req.ip);
    html = html.replace(/{ip}/gi, req.ip);
    html = HTMLencoding(html);

    return {html, categories: encoded.categories};
});

let adminPages = [];

let pluginMenu = [];

module.exports = {
	adminPages,
	pluginMenu,
	router: []
};