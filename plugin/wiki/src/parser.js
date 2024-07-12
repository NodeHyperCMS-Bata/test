const {getWikiDoc} = require("./docs");
const {addHook, getHook} = require("../../../src/hook");

let wiki_parsers = {
    async default(req, name, getWikiDoc, rever){
        return {
            html: `<pre>${(rever !== undefined ? getWikiDoc(name)?.revers[rever-1]?.contents : getWikiDoc(name)?.contents) || ''}</pre>`,
            categories: []
        };
    }
};

addHook('add_wiki_parser', (name, parser) => {
    wiki_parsers[name] = parser;
});

async function parse(req, name, rever){
    return await (wiki_parsers[req.siteInfo.wikiConfig.parser] || wiki_parsers.default)(req, name, getWikiDoc, rever);
}

module.exports = {parse, wiki_parsers};