import fs from "fs";
import fse from "fs-extra";
import path from "path";

import {colorlog} from "./colorlog";

class Table {
    constructor(databaseName, table){
		this.databaseName = databaseName;
		this.tableName = table;
		this.encodedTable = encodeURIComponent(table);
		this.table = path.join(databaseName, this.encodedTable);
		if(!fs.existsSync(this.table)){
			fs.writeFileSync(this.table, "null");
			this.read = null;
		} else {
			this.read = JSON.parse(
				fs.readFileSync(
					this.table,
					"utf8"
				)
			);
		}
    }

	getFileSync(){
		return JSON.parse(
			fs.readFileSync(
				this.table,
				"utf8"
			)
		);
    }

	getSync(){
		return this.getFileSync(); //this.read;
    }

	getJSONSync(){
		return {name: this.tableName, body: this.read};
    }
  
    setSync(data){
		fs.writeFileSync(
			this.table,
			JSON.stringify(data)
		);
		//this.read = data;
    }

	setJSONSync(json){
		try {
			this.setSync(json.body);
		} catch(err){
			throw "json is not correct.";
		}
	}
  
    removeSync(){
      	fs.unlinkSync(this.table);
    }

    async getFile(){
		return JSON.parse(
			await fs.promises.readFile(
				this.table,
				"utf8"
			)
		);
    }

	async get(){
		return await this.getFile(); //this.read;
    }

	async getJSON(){
		return {name: this.tableName, body: this.read};
    }
  
    async set(data){
		await fs.promises.writeFile(
			this.table,
			JSON.stringify(data)
		);
		//this.read = data;
    }

	async setJSON(json){
		try {
			this.set(json.body);
		} catch(err){
			throw "json is not correct.";
		}
	}
  
    async remove(){
		await fs.promises.unlink(
			this.table
		);
		//this.read = null;
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
		}
    }
  
    table(name){
      	return new Table(this.directory, name);
    }

	checkTable(name){
		return fs.existsSync(path.join(this.directory, encodeURIComponent(name)));
	}

	tables(){
		return fs.readdirSync(this.directory).map(element => decodeURIComponent(element));
	}

	getJSON(){
		let tables = this.tables();
		return {name: this.databaseName, body: tables.map((el) => {
			let table = new Table(this.directory, el);
			return table.getJSONSync();
		})};
    }

	setJSON(json){
		try {
			json.body.forEach(element => {
				let table = new Table(this.directory, element.name);
				table.setJSONSync(element);
			});
		} catch(err){
			throw "json is not correct.";
		}
	}

	clear(){
		fs.readdirSync(this.directory).forEach((file, index) => {
			fs.unlinkSync(path.join(this.directory, file));
		});
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
	let tables = fs.readdirSync(directory).map(element => decodeURIComponent(element));
	return {body: tables.map((el) => {
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
	let directory = 'database/';//path.join(process.cwd(), 'database/');

	try {
		fse.emptyDirSync(directory);
		fs.rmdirSync(directory);
	} catch(err){
		throw `${colorlog.red('[error]')} Database remove error: ${colorlog.red(err)}`;
	}
	return true;
}