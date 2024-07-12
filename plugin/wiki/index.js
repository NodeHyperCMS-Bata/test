const {Router, express} = require('../../src/router');
const {PluginRender} = require("../../src/plugin/render");
const {themeRequire} = require('../../src/themeRequire');
const {rootDir, path} = require("../../src/path");
const {getSiteInfoAwait, setSiteInfoAwait, setSiteInfo, getUserInfoAwait} = require("../../src/site");

const {getWikiDocsAsync, setWikiDocsAsync, getWikiDocAsync, setWikiDocAsync} = require("./src/docs");
const {parse, wiki_parsers} = require("./src/parser");

const fs = require("fs");

const render = new PluginRender('/plugin/wiki/ejs');

let router = new Router();
let theme = themeRequire();

if(!getSiteInfoAwait().wikiConfig){
    let siteInfo = getSiteInfoAwait();
    siteInfo.wikiConfig = {
        parser: 'default'
    };
    setSiteInfoAwait(siteInfo);
}

async function viewDoc(name, rever){
    let doc;
    if(!(doc = await getWikiDocAsync(name))) return {rever};

    if(rever !== undefined && !doc.revers[rever-1]) return {error: `리버전 ${rever}은 존재하지 않습니다.`};

    return {doc, rever};
}

async function editDoc(member_number, ip, name, contents, editSummary, revert){
    if(contents.length > 70000 || editSummary > 2000) return {error: '용량이 너무 많습니다.'}

    let doc = await getWikiDocAsync(name);

    if(!doc){
        doc = {
            date: new Date().getTime(),
            rever: 1,
            contents,
            revers: [{contents, editSummary, rever: 1, date: new Date().getTime(), id: member_number || -1, ip: ip}],
        };
    } else {
        doc.date = new Date().getTime();
        doc.rever++;
        doc.contents = contents;
        doc.revers.push({contents, editSummary, rever: doc.rever, date: new Date().getTime(), revert, id: member_number || -1, ip: ip});
        if(doc.deleted) doc.deleted = false;
    }

    await setWikiDocAsync(name, doc);

    return {};
}

async function moveDoc(member_number, ip, name, moveTitle, exchange, editSummary){
    let docs = await getWikiDocsAsync();

    if(docs[name]){
        if(docs[moveTitle]){
            if(!exchange){
                const oldDoc = structuredClone(docs[name]);

                const newRever = docs[moveTitle].rever;
                for(let i = 0; i < oldDoc.revers.length; i++){
                    oldDoc.revers[i].rever += newRever;
                }

                if(docs[moveTitle].deleted) docs[moveTitle].deleted = false;
                docs[moveTitle].revers.push(...oldDoc.revers);
                docs[moveTitle].rever = docs[moveTitle].revers.length+1;
                docs[moveTitle].contents = oldDoc.contents;
                docs[moveTitle].date = new Date().getTime();
                docs[moveTitle].revers.push({contents: docs[moveTitle].contents, editSummary, rever: docs[moveTitle].rever, move: moveTitle, date: new Date().getTime(), id: member_number || -1, ip: ip});
                    
                delete docs[name];
            } else {
                const oldDoc = structuredClone(docs[moveTitle]);
                docs[moveTitle] = structuredClone(docs[name]);

                docs[moveTitle].date = new Date().getTime();
                docs[moveTitle].rever++;
                docs[moveTitle].revers.push({contents: docs[moveTitle].contents, editSummary, rever: docs[moveTitle].rever, move: moveTitle, date: new Date().getTime(), id: member_number || -1, ip: ip});
                
                docs[name] = oldDoc;
            }
        } else {
            docs[moveTitle] = structuredClone(docs[name]);

            docs[moveTitle].date = new Date().getTime();
            docs[moveTitle].rever++;
            docs[moveTitle].revers.push({contents: docs[moveTitle].contents, editSummary, rever: docs[moveTitle].rever, move: moveTitle, date: new Date().getTime(), id: member_number || -1, ip: ip});
                
            delete docs[name];
        }
    }

    await setWikiDocsAsync(docs);

    return {};
}

async function deleteDoc(member_number, ip, name, editSummary){
    let doc = await getWikiDocAsync(name);

    if(doc){
        doc.date = new Date().getTime();
        doc.rever++;
        doc.contents = '';
        doc.revers.push({contents: '', editSummary, rever: doc.rever, date: new Date().getTime(), id: member_number || -1, ip: ip});
        doc.deleted = true;
    }

    await setWikiDocAsync(name, doc);
}

router.receive('/list', async (req, res) => {
    let docs_obj = await getWikiDocsAsync();
    let docs = [];

    for(const name in docs_obj){
        docs_obj[name].docName = name;
        docs_obj[name].revers = docs_obj[name].revers.map(rever => {
            rever.id = getUserInfoAwait(rever.id);
            return rever;
        });
        docs.push(docs_obj[name]);
    }

    let data = {
        docs: docs.sort((a, b) => b.date - a.date), 
        encodeURIComponent
    };
    render.render(data, req, res, 'list', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.get('/edit/:name', async (req, res) => {
    let name = req.params.name || '';

    let isFile = name.startsWith("파일:");

    let docs = await getWikiDocsAsync();

    render.render({
        name,
        url: encodeURIComponent(name),
        exists: !!docs[name],
        contents: docs[name]?.contents || '',
        isFile,
        isRevert: false
    }, req, res, 'edit', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.post('/edit/:name', async (req, res) => {
    const name = req.params.name, contents = req.body?.contents.replace(/\r\n/g, '\n') || '', editSummary = req.body?.editSummary || '';
    const {error} = await editDoc(req.userInfo?.member_number, req.ip, name, contents, editSummary);
    if(error) return res.msgRedirect(`/edit/${name}`, {type: 'danger', msg: error});

    res.msgRedirect(`/wiki/${name}`, {type: 'success', msg: `성공적으로 문서 ${name}가 편집되었습니다!`});
});

router.get('/delete/:name', async (req, res) => {
    let name = req.params.name || '';

    let docs = await getWikiDocsAsync();

    if(!docs[name]) return res.msgRedirect(`/wiki/${name}`, {type: 'danger', msg: "문서가 존재하지 않습니다."});

    render.render({
        name,
        url: encodeURIComponent(name),
        isMove: false
    }, req, res, 'move', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.post('/delete/:name', async (req, res) => {
    const name = req.params.name, editSummary = req.body?.editSummary || '';
    await deleteDoc(req.userInfo?.member_number, req.ip, name, editSummary);

    res.msgRedirect(`/wiki/${name}`, {type: 'success', msg: `성공적으로 문서 ${name}가 삭제되었습니다!`});
});

router.get('/revert/:name', async (req, res) => {
    let name = req.params.name || '', rever = (+req.query.rever)-1;

    let docs = await getWikiDocsAsync();

    if(!docs[name]) return res.msgRedirect(`/wiki/${name}`, {type: 'danger', msg: "문서가 존재하지 않습니다."});
    if(!docs[name].revers[rever]) return res.msgRedirect(`/wiki/${name}`, {type: 'danger', msg: "해당 리버전이 존재하지 않습니다."});

    render.render({
        name,
        url: encodeURIComponent(name),
        exists: true,
        contents: docs[name].revers[rever]?.contents || '',
        isRevert: true,
        isFile: name.startsWith("파일:"), 
        revertRever: docs[name].revers[rever]
    }, req, res, 'edit', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.post('/revert/:name', async (req, res) => {
    const name = req.params.name, contents = req.body?.contents.replace(/\r\n/g, '\n') || '', editSummary = req.body?.editSummary || '', rever = +req.query.rever;
    const {error} = await editDoc(req.userInfo?.member_number, req.ip, name, contents, editSummary, isNaN(rever) ? undefined : rever);
    if(error) return res.msgRedirect(`/edit/${name}`, {type: 'danger', msg: error});

    res.msgRedirect(`/wiki/${name}`, {type: 'success', msg: `성공적으로 문서 ${name}가 편집되었습니다!`});
});

router.get('/move/:name', async (req, res) => {
    let name = req.params.name || '';

    let docs = await getWikiDocsAsync();

    if(!docs[name]) return res.msgRedirect(`/wiki/${name}`, {type: 'danger', msg: "문서가 존재하지 않습니다."});

    render.render({
        name,
        url: encodeURIComponent(name),
        isMove: true
    }, req, res, 'move', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.post('/move/:name', async (req, res) => {
    const name = req.params.name, title = req.body?.title || '', editSummary = req.body?.editSummary || '', exchange = req.body?.exchange === 'on';
    let {error} = await moveDoc(req.userInfo?.member_number, req.ip, name, title, exchange, editSummary);
    if(error) return res.msgRedirect(`/move/${name}`, {type: 'danger', msg: error});

    res.msgRedirect(`/wiki/${title}`, {type: 'success', msg: `성공적으로 문서 ${name}가 이동되었습니다!`});
});

router.all('/wiki/:name(*)', async (req, res) => {
    let name = req.params.name, noredirect = !!req.query.noredirect, from = req.query.from;

    let file = name.startsWith("파일:");
    let fileraw = file && name.endsWith("/img");
    if(fileraw) name = name.slice(0, -4);

    let {doc, rever, error} = await viewDoc(name, req.query.rever);
    if(error) return res.msgRedirect(`/wiki/${name}`, {type: 'danger', msg: error});
    if(!doc){
        render.render({
            name,
            url: encodeURIComponent(name),
            html: '',
            categories: [],
            date: '',
            exists: false,
            deleted: false,
            rever: 1,
            oldrever: false,
            israw: false,
            encodeURIComponent
        }, req, res, 'wiki', (err, str) => {
            if(err) console.error(err);
            res.status(200).send(str);
        });
        return;
    }
    
    if(rever === undefined) rever = doc.rever;

    let html = '', categories = [], redirect;

    if(!file){
        const parseResult = await parse(req, name, rever);
        html = parseResult.html;
        categories = parseResult.categories;
        redirect = parseResult.redirect;

        if(redirect && !noredirect){
            return res.redirect(`/wiki/${redirect}?from=${encodeURIComponent(name)}`);
        }
    } else {
        html = doc.revers[rever-1].contents;
        if(fileraw){
            try {
                const parts = html.split(',');

                const data = parts[0].split(':')[1];
                const base64 = parts[1];

                const binaryData = Buffer.from(base64, 'base64');

                res.writeHead(200, {
                    'Content-Type': data,
                    'Content-Length': binaryData.length
                });

                return res.end(binaryData);
            } catch(err){

            }
        }
    }
    
    render.render({
        name,
        url: encodeURIComponent(name),
        html: html,
        categories: categories,
        date: doc.date || 10243444,
        exists: true,
        deleted: doc.deleted || false,
        noredirect: redirect,
        from,
        revers: doc.revers.slice(-5).map(rever => {
            rever.id = getUserInfoAwait(rever.id);
            return rever;
        }).sort((a, b) => b.date - a.date),
        nosortRevers: doc.revers,
        rever: rever,
        oldrever: doc.rever !== rever,
        israw: false,
        file,
        encodeURIComponent
    }, req, res, 'wiki', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.all('/raw/:name', async (req, res) => {
    const name = req.params.name;

    let {doc, rever, error} = await viewDoc(name, req.query.rever);
    if(error) return res.msgRedirect(`/edit/${name}`, {type: 'danger', msg: error});
    if(!doc){
        render.render({
            name,
            url: encodeURIComponent(name),
            html: '',
            categories: [],
            date: '',
            exists: false,
            deleted: false,
            rever: 1,
            oldrever: false,
            israw: true,
            encodeURIComponent
        }, req, res, 'wiki', (err, str) => {
            if(err) console.error(err);
            res.status(200).send(str);
        });
        return;
    }

    if(rever === undefined) rever = doc.rever;
    
    render.render({
        name,
        url: encodeURIComponent(name),
        html: doc.revers[rever-1]?.contents,
        categories: [],
        date: doc.date || 10243444,
        exists: true,
        deleted: doc.deleted || false,
        revers: doc.revers.slice(-5).map(rever => {
            rever.id = getUserInfoAwait(rever.id);
            return rever;
        }).sort((a, b) => b.date - a.date),
        nosortRevers: doc.revers,
        rever: rever,
        oldrever: doc.rever !== rever,
        israw: true,
        encodeURIComponent
    }, req, res, 'wiki', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.all('/history/:name', async (req, res) => {
    const name = req.params.name;

    let {doc, error} = await viewDoc(name);
    if(error) return res.msgRedirect(`/edit/${name}`, {type: 'danger', msg: error});
    
    render.render({
        name,
        url: encodeURIComponent(name),
        revers: doc.revers.map(rever => {
            rever.id = getUserInfoAwait(rever.id);
            return rever;
        }).sort((a, b) => b.date - a.date),
        nosortRevers: doc.revers,
        encodeURIComponent
    }, req, res, 'history', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.get('/new-wiki-document.php', async (req, res) => {
    render.render({}, req, res, 'new-document', (err, str) => {
        if(err) console.error(err);
        res.status(200).send(str);
    });
});

router.post('/new-wiki-document.php', async (req, res) => {
    const name = req.body?.name || '', contents = req.body?.contents.replace(/\r\n/g, '\n') || '', editSummary = req.body?.editSummary || '';
    if(name === '') return res.msgRedirect(`/edit/${name}`, {type: 'danger', msg: '문서 이름이 빈칸 일수는 없습니다.'}); 
    const {error} = await editDoc(req.userInfo?.member_number, req.ip, name, contents, editSummary);
    if(error) return res.msgRedirect(`/edit/${name}`, {type: 'danger', msg: error});

    res.msgRedirect(`/wiki/${name}`, {type: 'success', msg: `성공적으로 문서 ${name}가 생성되었습니다!`});
});

router.use('/wiki-static', express.static(path.join(__dirname, 'static')))

let adminPages = [
	{
        url: 'settings', 
        async routing(req, res, render){
            if(req.body.parser){
                req.siteInfo.wikiConfig.parser = req.body.parser;
                await setSiteInfo(req.siteInfo);

                res.msgRedirect('/admin/plugin/wiki/settings', {type: 'success', msg: '성공적으로 위키 설정이 수정되었습니다!'});
            } else {
                await render({
                    data: {wiki_parsers},
                    page: rootDir("/plugin/wiki", 'admin/index')
                });
            }
        }
    }
];

let pluginMenu = [
	{name: '위키 설정', icon: "fas fa-gear", href: "/plugin/wiki/settings", icon: "fas fa-gear"}
];

module.exports = {
	adminPages,
	pluginMenu,
	router: [router]
};