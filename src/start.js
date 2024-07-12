import dotenv from "dotenv";
dotenv.config();

import {Database, eraseDatabase} from "./database";

import {addMember} from "./site";

import express from "express";
import session from "express-session";
import cors from "cors";
import http from "http";

import {rootDir} from "./path";
import {colorlog} from "./colorlog";
import {addText} from "./log";
import ip from "ip";

import fs from "fs";

const port = process.env.POST || 3000;

async function setDatabase(config){
	let site_DB = new Database('site');

	let table_members = site_DB.table('members');
	let table_member_names = site_DB.table('member_names');
    let table_member_number = site_DB.table('member_number');
	let table_owner = site_DB.table('owner');
	let table_site = site_DB.table('site');
	let table_visit = site_DB.table('visit');
    let table_notices = site_DB.table('notices');

	await table_member_number.set(0);
	await table_members.set(new Array());
	await table_member_names.set(new Object());
	await table_owner.set(0);
	await table_site.set(config.site);
	await table_visit.set([]);
    await table_notices.set({});

    await addMember(config.admin.id, config.admin.password, 15, true);
}

function startServer(){
	return new Promise(async (resolve, reject) => {
		let app = express();
		let server;

		app.use(express.json({
			limit: "50mb"
		}));

		app.use(express.urlencoded({
			limit: "50mb",
			extended: true
		}));

		app.use(session({
			secret: "keyboard cat",
			resave: false,
			saveUninitialized: true
		}));

		app.use(cors());

		app.all('/install', async (req, res) => {
			let default_config = require(rootDir('default_config.js')).default;
			let html = `
			<!doctype html>
			<html lang="ko">
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1">
					<title>NodeHyperCMS install</title>
					<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
				</head>
				<body>
				<div class="modal d-block">
					<div class="modal-dialog modal-dialog-scrollable">
						<div class="modal-content">
			`;
			if(req.session.step !== undefined){
				if(req.query.previous === ''){
					if(req.session.step > 0) req.session.step--;
				} else if(req.query.next === ''){
					if(req.session.step < 4) req.session.step++;
				}
			}
			if(
				req.session.step === undefined || 
				req.session.step === 0 || 
				!(
					req.query.previous !== undefined || 
					req.query.next !== undefined
				)
			){
				html += `
				<div class="modal-header">
                    <h5 class="modal-title">NodeHyperCMS 설치</h5>
                </div>
                <div class="modal-body">
                    <p>NodeHyperCMS에 오신걸 환영합니다! 설치가 거의 다 됬습니다. 이제 몇몇 질문에만 답해주면 됩니다!</p>
                </div>
                <div class="modal-footer">
                    <a role="button" class="btn btn-primary" href="/install?next">다음</a>
                </div>
				`;
				req.session.step = 0;
			} else if(req.session.step === 4 && req.query.next === ""){
                html += `
				<div class="modal-header">
					<h5 class="modal-title">NodeHyperCMS 설치 완료!</h5>
				</div>
				<div class="modal-body">
					<p>NodeHyperCMS 설치가 완료되었습니다!</p>
					<p>이제 5초 후 서버가 시작됩니다.</p>
					<p></p>
					<p>남은 시간(예상): <span id="reload_time">5</span>초</p>
				</div>
				<script>
					let reload_time = document.getElementById('reload_time');

					setTimeout(() => {
						reload_time.innerHTML = 4;
						setTimeout(() => {
							reload_time.innerHTML = 3;
							setTimeout(() => {
								reload_time.innerHTML = 2;
								setTimeout(() => {
									reload_time.innerHTML = 1;
									setTimeout(() => {
										reload_time.innerHTML = 0;
										window.location = '/';
									}, 1000);
								}, 1000);
							}, 1000);
						}, 1000);
					}, 1000);
				</script>
				`;
            } else {
				switch(req.session.step){
					case 1: {
						html += `
                        <form action="/install?next" method="post">
                            <div class="modal-header">
                                <h5 class="modal-title">NodeHyperCMS 설치</h5>
                            </div>
                            <div class="modal-body">
                                <p>사이트 설정</p>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="site_title" name="site_title" placeholder="Title" value="${default_config.site.title}">
                                    <label for="site_title">Title</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <textarea class="form-control" id="site_description" name="site_description" placeholder="Description" style="height: 100px">${default_config.site.description}</textarea>
                                    <label for="site_description">Description</label>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <a role="button" class="btn btn-secondary" href="/install?previous">이전</a>
                                <input class="btn btn-primary" type="submit" value="다음">
                            </div>
                        </form>
						`;
						break;
					}
					case 2: {
						req.session.data = {};
						let post = req.body;
						let default_data = default_config.site;
						req.session.data.site_title = post.site_title || default_data.title;
						req.session.data.site_description = post.site_description || default_data.description;
						html += `
                        <form action="/install?next" method="post">
                            <div class="modal-header">
                                <h5 class="modal-title">NodeHyperCMS 설치</h5>
                            </div>
                            <div class="modal-body">
                                <p>관리자 설정</p>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="admin_id" name="admin_id" placeholder="admin" value="${default_config.admin.id}">
                                    <label for="admin_id">Username</label>
                                </div>
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="admin_password" name="admin_password" placeholder="test" value="${default_config.admin.password}">
                                    <label for="admin_password">Password</label>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <a role="button" class="btn btn-secondary" href="/install?previous">이전</a>
                                <input class="btn btn-primary" type="submit" value="다음">
                            </div>
                        </form>
						`;
						break;
					}
					case 3: {
						let post = req.body;
						let default_data = default_config.admin;
						req.session.data.admin_id = post.admin_id || default_data.id;
						req.session.data.admin_password = post.admin_password || default_data.password;
						let {site_title, site_description, admin_id, admin_password} = req.session.data;
						html += `
                        <div class="modal-header">
                            <h5 class="modal-title">NodeHyperCMS 설치</h5>
                        </div>
						<div class="modal-body">
							<p>모든 준비가 완료되었습니다! 설정을 확인하십시오.</p>
							<table class="table">
								<thead>
									<tr>
										<th scope="col">Name</th>
										<th scope="col">Value</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Site title</td>
										<td>${site_title}</td>
									</tr>
									<tr>
										<td>Site description</td>
										<td>${site_description}</td>
									</tr>
									<tr>
										<td>Admin id</td>
										<td>${admin_id}</td>
									</tr>
									<tr>
										<td>Admin password</td>
										<td>${admin_password}</td>
									</tr>
								</tbody>
							</table>
						</div>
                        <div class="modal-footer">
                            <a role="button" class="btn btn-secondary" href="/install?previous">이전</a>
                            <a role="button" class="btn btn-primary" href="/install?next">설치</a>
                        </div>
						`;
						break;
					}
				}
			}
			html += `
						</div>
					</div>
				</div>
				<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
				</body>
			</html>
			`;
			res.status(200).send(html);
		if(req.session.step === 4){
				let {site_title, site_description, admin_id, admin_password} = req.session.data;
				let config = {
					admin: {
						id: admin_id,
						password: admin_password
					}
				};
				config.site = Object.assign(default_config.site, {
					title: site_title,
					description: site_description
				});

                fs.writeFileSync(
                    rootDir('config.js'),
                    `export default ${JSON.stringify(config, null, '\t')};`
                );

                await setDatabase(config);

                server.close();
                resolve();
            }
		});

		app.all('/', (req, res) => {
			res.redirect('/install');
		});

		server = http.createServer(app).listen(port, () => {
			console.log(`\nConfig server start ${colorlog.green('successfully!')}\n`);
            console.log(`${colorlog.green('Ready')} on port: ${port}.\n`);
            console.log(`Local:            ${colorlog.blue(`http://localhost:${port}`)}`);
            console.log(`On Your Network:  ${colorlog.blue(`http://${ip.address()}:${port}`)}`);
		});
	});
}

export default async function start(){
	if((process.env.CONFIG || 'web') === 'web'){
		await startServer();
	} else {
        let config = require(rootDir('config.js')).default;

		await setDatabase(config);
	}
}

// NodeHyperCMS