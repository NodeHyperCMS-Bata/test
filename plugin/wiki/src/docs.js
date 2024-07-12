const {DBs, tables} = require("../../../src/site");

if(!tables.wikiDocs){
	tables.wikiDocs = DBs.site.table('wikiDocs');
	if(!tables.wikiDocs.getSync()) tables.wikiDocs.setSync({});
}

if(!tables.wikiDocs){
	tables.wikiDocs = DBs.site.table('wikiDocs');
	if(!tables.wikiDocs.getSync()) tables.wikiDocs.setSync({});
}

function getWikiDocs(){
	return tables.wikiDocs.getSync();
}

function setWikiDocs(docs){
	return tables.wikiDocs.setSync(docs);
}

function getWikiDoc(title){
	let docs = getWikiDocs();
	return docs[title];
}

function setWikiDoc(title, doc){
	let docs = getWikiDocs();
    docs[title] = doc;
	console.log(doc)
    setWikiDocs(docs);
	return doc;
}

async function getWikiDocsAsync(){
	return await tables.wikiDocs.get();
}

async function setWikiDocsAsync(docs){
	return await tables.wikiDocs.set(docs);
}

async function getWikiDocAsync(title){
	let docs = await getWikiDocsAsync();
	return docs[title];
}

async function setWikiDocAsync(title, doc){
	let docs = await getWikiDocsAsync();
    docs[title] = doc;
    await setWikiDocsAsync(docs);
	return doc;
}

module.exports = {
	getWikiDocs,
	setWikiDocs,
	getWikiDoc,
    setWikiDoc,
	getWikiDocsAsync,
	setWikiDocsAsync,
	getWikiDocAsync,
	setWikiDocAsync
};