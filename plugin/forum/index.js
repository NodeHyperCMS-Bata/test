const {Router} = require('../../src/router');
const {io} = require("../../src/app");
const {themeRequire} = require('../../src/themeRequire');
const {rootDir} = require("../../src/path");

const {HTMLencoding} = require("../../src/plugin/HTMLencoding");
const {DBs, tables, getUserInfo, getMembers} = require("../../src/site");
const {log} = require("../../src/log");

let router = new Router();
let theme = themeRequire();

const noticeId = 'Forum Activity';

if(!tables.forumPosts){
	tables.forumPosts = DBs.site.table('forumPosts');
	if(!tables.forumPosts.getSync()) tables.forumPosts.setSync({});
} //tables.forumPosts.setSync({});

function render(data, req, res, file, cb){
	theme.render(data, theme.basicData(req, res), rootDir("/plugin/forum/ejs/", file), (err, str) => {
		cb(err, str);
	});
}

function encodePostName(posts, name){
	name = name.replace(/ /g, '-').replace(/\//g, '-').replace(/\?/g, '-').replace(/#/g, '-').replace(/&/g, '-').replace(/=/g, '-');

	function walk(_name){
		if(posts[_name]){
			_name = `${_name}-1`;
			return walk(_name);
		}
		return _name;
	}

	return walk(name);
}

function isEditble(post, req){
	return req.userInfo?.isadmin || req.userInfo?.member_number === post.member || (post.member === -1 && req.ip === post.ip);
}

function encodingNotice(notice){
	return {
		url: notice.url, 
		content: (
			notice.type === 'forum' ? 
				`새 포럼이 있습니다 <span class="text-primary">${notice.name}</span>`
			:
				`포럼 <span class="text-primary">${notice.name}</span>에 새 댓글이 ${notice.count}개 있습니다 `
		)
	};
}

function updateNoticesSocket(user, notices){
	let encodingNotices = {};
	for(const type in notices){
		encodingNotices[type] = [];
		notices[type].forEach((el, i) => {
			encodingNotices[type][i] = encodingNotice(el);
		});
	}
	io.to(user).emit('update-notice', encodingNotices);
}

async function addNotice(req, notice){
    let writer = req.userInfo?.member_number;

    let notices = await tables.notices.get();

    let users = await getMembers();
	for(const key in users){
		const user = +key;

		if(user !== writer){
            if(!notices[user]) notices[user] = {[noticeId]: [notice]};
			else if(!notices[user][noticeId]) notices[user][noticeId] = [notice];
            else {
				if(notice.type === 'comment'){
					let push = false;
					notices[user][noticeId].forEach(el => {
						if(el.forum === notice.forum && el.type === 'comment'){
							el.count++;
							push = true;
						}
					});
					if(!push) notices[user][noticeId].push(notice);
				} else notices[user][noticeId].push(notice);
			}

			updateNoticesSocket(user, notices[user]);
		}
	}
    
    await tables.notices.set(notices);
}

async function myNotice(user){
	return ((await tables.notices.get())[user] || {})[noticeId] || [];
}

async function removeNotice(cb){
	let notices = await tables.notices.get();

    let users = await getMembers();
	for(const key in users){
		const user = +key;

		if(!notices[user]) notices[user] = {[noticeId]: []};
		else if(!notices[user][noticeId]) notices[user][noticeId] = [];
		else notices[user][noticeId] = notices[user][noticeId].filter(cb);

		updateNoticesSocket(user, notices[user]);
	}
    
    await tables.notices.set(notices);
}

function updateNotices(req, notices){
    if(!req.notices) req.notices = {[noticeId]: []};
	notices.forEach(notice => {
		req.notices[noticeId].push(encodingNotice(notice));	
	});
}

router.use(async (req, res, next) => {
	if(req.userInfo){
		let notices = await myNotice(req.userInfo?.member_number);
		updateNotices(req, notices);
	}
	next();
});

router.receive('/forum', async (req, res) => {
	let forumPosts = await tables.forumPosts.get();
	let posts = [];
	for(const key in forumPosts){
		let post = forumPosts[key];
		post.url = encodeURIComponent(key);
		post.userInfo = await getUserInfo(post.member);
		posts.push(post);
	}
	
	let data = {posts: posts.sort((a, b) => b.date - a.date)};
	render(data, req, res, 'index', (err, str) => {
		if(err) console.error(err);
		res.status(200).send(str);
	});
});

router.all('/forum/new-forum.php', (req, res) => {
	let data = {};
	render(data, req, res, 'new-forum', (err, str) => {
		if(err) console.error(err);
		res.status(200).send(str);
	});
});

router.all('/forum/add-post.php', async (req, res) => {
	if(!req.body.name || !req.body.contents || req.body.name === ' '){
		res.msgRedirect(req.headers.referer, {type: 'danger', msg: '제목이나 내용이 비여있습니다.'});
		return;
	} 

	let posts = await tables.forumPosts.get();

	let contents = HTMLencoding(req.body.contents), 
		name = req.body.name, 
		encodingName = encodePostName(posts, req.body.name);

	posts[encodingName] = {
		name,
		date: new Date().getTime(),
		member: req.userInfo?.member_number || -1,
		ip: req.ip,
		contents,
		comments: []
	};
	await tables.forumPosts.set(posts);

    await addNotice(req, {name: name, forum: encodingName, url: '/forum/view/'+encodeURIComponent(encodingName), type: 'forum'});

	res.msgRedirect('/forum/view/'+encodeURIComponent(encodingName), {type: 'success', msg: '성공적으로 포럼이 게시되었습니다!'});
});

router.all('/forum/add-comment.php', async (req, res) => {
	let posts = await tables.forumPosts.get();

	if(!req.query.post || !posts[decodeURIComponent(req.query.post)]){
		res.msgRedirect(req.headers.referer, {type: 'danger', msg: '포럼이 존재하지 않습니다.'});
		return;
	} 

	if(!req.body.contents || req.body.contents === ' '){
		res.msgRedirect(req.headers.referer, {type: 'danger', msg: '내용이 비여있습니다.'});
		return;
	} 

	let contents = HTMLencoding(req.body.contents), 
		name = decodeURIComponent(req.query.post);

	posts[name].comments.push({
		date: new Date().getTime(),
		member: req.userInfo?.member_number || -1,
		ip: req.ip,
		contents
	});

	await tables.forumPosts.set(posts);

	await addNotice(req, {name: posts[name].name, forum: name, comment: posts[name].comments.length-1, count: 1, url: '/forum/view/'+encodeURIComponent(name), type: 'comment'});

	res.msgRedirect('/forum/view/'+encodeURIComponent(name), {type: 'success', msg: '성공적으로 댓글이 게시되었습니다!'});
});

router.all('/forum/edit-comment.php', async (req, res) => {
	let posts = await tables.forumPosts.get();

	if(!req.query.post || !posts[decodeURIComponent(req.query.post)]){
		res.msgRedirect(req.headers.referer, {type: 'danger', msg: '포럼이 존재하지 않습니다.'});
		return;
	} 

	let name = decodeURIComponent(req.query.post), comment = req.query.comment;

	if(!posts[name].comments[req.query.comment]){
		res.msgRedirect(req.headers.referer, {type: 'danger', msg: '댓글이 존재하지 않습니다.'});
		return;
	} 

	if(isEditble(posts[name].comments[comment], req)){
		if(req.body.contents){
			if(req.body.contents === ' '){
				res.msgRedirect(req.headers.referer, {type: 'danger', msg: '내용이 비여있습니다.'});
				return;
			} 
		
			let contents = HTMLencoding(req.body.contents);
		
			posts[name].comments[comment].contents = contents;
			posts[name].comments[comment].date = new Date().getTime();

			await tables.forumPosts.set(posts);
		
			res.msgRedirect('/forum/view/'+encodeURIComponent(name), {type: 'success', msg: '성공적으로 댓글이 편집되었습니다!'});
		} else {
			let post = posts[name];

			post.key = req.params.name;
			post.url = encodeURIComponent(post.key);
			post.userInfo = await getUserInfo(post.member);

			let comments = [];
			for(const key in post.comments){
				let comment = post.comments[key];
				comment.url = encodeURIComponent(key);
				comment.userInfo = await getUserInfo(comment.member);
				comment.isEditble = isEditble(comment, req);
				comments.push(comment);
			}
			
			let data = {
				post,
				comments,
				isEditble: isEditble(post, req),
				comment_edit: posts[name].comments[comment].contents
			};

			render(data, req, res, 'view', (err, str) => {
				if(err) console.error(err);
				res.status(200).send(str);
			});
		}
	} else {
		res.msgRedirect(req.headers.referer, {type: 'danger', msg: '해당 댓글을 편집할 권한이 없습니다.'});
	}
});

router.all('/forum/delete-comment.php', async (req, res) => {
	let posts = await tables.forumPosts.get();

	if(!req.query.post || !posts[decodeURIComponent(req.query.post)]){
		res.msgRedirect(req.headers.referer, {type: 'danger', msg: '포럼이 존재하지 않습니다.'});
		return;
	} 

	let name = decodeURIComponent(req.query.post), comment = req.query.comment;

	if(!posts[name].comments[req.query.comment]){
		res.msgRedirect(req.headers.referer, {type: 'danger', msg: '댓글이 존재하지 않습니다.'});
		return;
	} 

	if(isEditble(posts[name].comments[comment], req)){
		posts[name].comments.splice(comment, 1);

		await tables.forumPosts.set(posts);

		await removeNotice(notice => notice.comment !== comment);
		
		res.msgRedirect('/forum/view/'+encodeURIComponent(name), {type: 'success', msg: '성공적으로 댓글이 삭제되었습니다!'});
	} else {
		res.msgRedirect(req.headers.referer, {type: 'danger', msg: '해당 댓글을 삭제할 권한이 없습니다.'})
	}
});

router.receive('/forum/view/:name', async (req, res) => {
	let post = (await tables.forumPosts.get())[req.params.name];

	if(post){
        post.key = req.params.name;
		post.url = encodeURIComponent(post.key);
		post.userInfo = await getUserInfo(post.member);

		let comments = [];
		for(const key in post.comments){
			let comment = post.comments[key];
			comment.url = encodeURIComponent(key);
			comment.userInfo = await getUserInfo(comment.member);
			comment.isEditble = isEditble(comment, req);
			comments.push(comment);
		}
		
		let data = {
            post,
			comments,
            isEditble: isEditble(post, req)
        };

		if(req.userInfo){
			let notices = await tables.notices.get();
			if(notices[req.userInfo.member_number] && notices[req.userInfo.member_number][noticeId] && notices[req.userInfo.member_number][noticeId].length > 0){
				notices[req.userInfo.member_number][noticeId] = notices[req.userInfo.member_number][noticeId].filter(notice => notice.forum !== req.params.name);
				await tables.notices.set(notices);

				updateNotices(req, notices[req.userInfo.member_number][noticeId]);
			}
		}

		render(data, req, res, 'view', (err, str) => {
			if(err) console.error(err);
			res.status(200).send(str);
		});
	} else {
		let data = {};
		render(data, req, res, '404-forum', (err, str) => {
			if(err) console.error(err);
			res.status(200).send(str);
		});
	}
});

router.receive('/forum/edit/:name', async (req, res) => {
	let posts = await tables.forumPosts.get();
	let post = posts[req.params.name];

	if(post){
		if(isEditble(post, req)){
			if(req.body.name && req.body.contents){
				if(req.body.name === ' '){
					res.msgRedirect(req.headers.referer, {type: 'danger', msg: '제목이 비여있습니다.'})
					return;
				}

				posts[req.params.name].date = new Date().getTime();
				posts[req.params.name].name = req.body.name;
				posts[req.params.name].contents = HTMLencoding(req.body.contents);
			
				await tables.forumPosts.set(posts);
			
				res.msgRedirect('/forum/view/'+encodeURIComponent(req.params.name), {type: 'success', msg: '성공적으로 포럼이 편집되었습니다!'});
			} else {
				post.userInfo = await getUserInfo(post.member);
			
				let data = {post};
				render(data, req, res, 'edit-forum', (err, str) => {
					if(err) console.error(err);
					res.status(200).send(str);
				});
			}
		} else {
			let data = {isEdit: true};
			render(data, req, res, '403-edit', (err, str) => {
				if(err) console.error(err);
				res.status(200).send(str);
			});
		}
	} else {
		let data = {};
		render(data, req, res, '404-forum', (err, str) => {
			if(err) console.error(err);
			res.status(200).send(str);
		});
	}
});

router.receive('/forum/delete/:name', async (req, res) => {
	let posts = await tables.forumPosts.get();
	let post = posts[req.params.name];

	if(post){
		if(isEditble(post, req)){
			delete posts[req.params.name];

			await tables.forumPosts.set(posts);

			await removeNotice(notice => notice.forum !== req.params.name);

			res.msgRedirect('/forum/', {type: 'success', msg: '성공적으로 포럼이 삭제되었습니다!'});
		} else {
			let data = {isEdit: false};
			render(data, req, res, '403-edit', (err, str) => {
				if(err) console.error(err);
				res.status(200).send(str);
			});
		}
	} else {
		let data = {};
		render(data, req, res, '404-forum', (err, str) => {
			if(err) console.error(err);
			res.status(200).send(str);
		});
	}
});

let adminPages = [];

let pluginMenu = [];

module.exports = {
	adminPages,
	pluginMenu,
	router: [router]
};