const fs = require("fs");
const path = require("path");

const colorlog = {red: console.error};

const getTableFileName = (directory, idx) => directory+'/file_'+idx+'.db';

class Table {
	constructor(tableName, directory, idx){
		this.tableName = tableName;
		this.idx = idx;
		this.directory = directory;
		this.file = getTableFileName(directory, idx);
	}

	getFileSync(){
		const dataBuffer = fs.readFileSync(this.file);
		const dataJSON = dataBuffer.toString();
		const read = JSON.parse(dataJSON);

		return read;
	}

	getSync(){
		return this.getFileSync();
	}

	getJSONSync(){
		const dataBuffer = fs.readFileSync(this.file);
		const dataJSON = dataBuffer.toString();
		const read = JSON.parse(dataJSON);

		return {name: this.tableName, body: read};
	}
  
	setSync(data){
		fs.writeFileSync(this.file, JSON.stringify(data));
	}

	setJSONSync(json){
		try {
			this.setSync(json.body);
		} catch(err){
			throw "json is not correct.";
		}
	}
  
	removeSync(){
		const dataBuffer = fs.readFileSync(this.directory+'/fileToIndex.db');
		const dataJSON = dataBuffer.toString();
		const fileToIndex = JSON.parse(dataJSON);
		fs.unlinkSync(this.file);
		delete fileToIndex[this.tableName];
		fs.writeFileSync(this.directory+'/fileToIndex.db', JSON.stringify(fileToIndex));
	}

	async getFile(){
		const dataBuffer = await fs.promises.readFile(this.file);
		const dataJSON = dataBuffer.toString();
		const read = JSON.parse(dataJSON);

		return read;
	}

	async get(){
		return await this.getFile();
	}

	async getJSON(){
		return {name: this.tableName, body: this.read};
	}
  
	async set(data){
		await fs.promises.writeFile(this.file, JSON.stringify(data));
	}

	async setJSON(json){
		try {
			this.set(json.body);
		} catch(err){
			throw "json is not correct.";
		}
	}
  
	async remove(){
		const dataBuffer = fs.readFileSync(this.directory+'/fileToIndex.db');
		const dataJSON = dataBuffer.toString();
		const fileToIndex = JSON.parse(dataJSON);

		fs.unlinkSync(this.file);
		delete fileToIndex[this.tableName];

		fs.writeFileSync(this.directory+'/fileToIndex.db', JSON.stringify(fileToIndex));
	}
}

export class Database {
	constructor(databaseName){
		this.databaseName = databaseName;
		this.directory = path.join(process.cwd(), 'database');
	
		if(!fs.existsSync(this.directory)){
			fs.mkdirSync(this.directory);
		}

		this.directory = path.join(this.directory, encodeURIComponent(databaseName));
	
		if(!fs.existsSync(this.directory)){
			fs.mkdirSync(this.directory);
			
			fs.writeFileSync(this.directory+'/fileToIndex.db', '{}');

			fs.writeFileSync(this.directory+'/index.idx', '0');
		}
	}
  
	table(name){
		const dataBuffer = fs.readFileSync(this.directory+'/fileToIndex.db');
		const dataJSON = dataBuffer.toString();
		const fileToIndex = JSON.parse(dataJSON);

		if(fileToIndex[name]) return new Table(name, this.directory, fileToIndex[name]);

		const index = JSON.parse(fs.readFileSync(this.directory+'/index.idx').toString())+1;
		fileToIndex[name] = index;

		fs.writeFileSync(this.directory+'/index.idx', `${index}`);

		fs.writeFileSync(this.directory+'/file_'+index+'.db', 'null');
		fs.writeFileSync(this.directory+'/fileToIndex.db', JSON.stringify(fileToIndex));

	  	return new Table(name, this.directory, index);
	}

	checkTable(name){
		const dataBuffer = fs.readFileSync('./database/'+databaseName+'/fileToIndex.db');
		const dataJSON = dataBuffer.toString();
		const fileToIndex = JSON.parse(dataJSON);

		return fileToIndex.hasOwnProperty(name);
	}

	tables(){
		const dataBuffer = fs.readFileSync('./database/'+databaseName+'/fileToIndex.db');
		const dataJSON = dataBuffer.toString();
		const fileToIndex = JSON.parse(dataJSON);

		return Object.keys(fileToIndex);
	}

	getJSON(){
		const dataBuffer = fs.readFileSync('./database/'+databaseName+'/fileToIndex.db');
		const dataJSON = dataBuffer.toString();
		const fileToIndex = JSON.parse(dataJSON);

		const body = [];

		for(const tableName in fileToIndex){
			const table = new Table(tableName, this.directory, fileToIndex[tableName]);

			body.push(table.getJSONSync());
		}

		return {name: this.databaseName, body};
	}

	setJSON(json){
		try {
			json.body.forEach(element => {
				let table = this.table(element.name);
				table.setJSONSync(element);
			});
		} catch(err){
			throw "json is not correct.";
		}
	}

	clear(){
		const dataBuffer = fs.readFileSync(this.directory+'/fileToIndex.db');
		const dataJSON = dataBuffer.toString();
		const fileToIndex = JSON.parse(dataJSON);

		for(const tableName in fileToIndex){
			fs.unlinkSync(this.directory+'/file_'+fileToIndex[tableName]+'.db');
			delete fileToIndex[tableName];
		}

		fs.writeFileSync(this.directory+'/index.idx', 0);

		fs.writeFileSync(this.directory+'/fileToIndex.db', JSON.stringify(fileToIndex));
	}
  
	remove(){
		this.clear();
		fs.rmdirSync(this.directory);
	}
}  

export function existsDatabase(){
	return fs.existsSync(path.join(process.cwd(), 'database'));
}

export function checkDatabase(name){
	return existsDatabase() && fs.existsSync(path.join(process.cwd(), 'database', encodeURIComponent(name)));
}

export function getJSON(){
	let directory = path.join(process.cwd(), 'database');
	return {body: fs.readdirSync(directory).map((el) => {
		let database = new Database(el);
		return database.getJSON();
	})};
}

export function setJSON(json){
	try {
		json.body.forEach(element => {
			let database = new Database(element.name);
			database.setJSON(element);
		});
	} catch(err){
		throw "json is not correct.";
	}
}

export function eraseDatabase(){
	let directory = path.join(process.cwd(), 'database');

	try {
		fs.readdirSync(directory).forEach((el) => {
			let database = new Database(el);

			database.remove();
		});

		fs.rmdirSync(directory);
	} catch(err){
		throw `${colorlog.red('[error]')} Database remove error: ${colorlog.red(err)}`;
	}
	return true;
}
