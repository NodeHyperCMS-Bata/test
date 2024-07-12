import http from "http";

import express from "express";
import {Server as socketio} from "socket.io";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import sessionStore from "./sessionStore";

import {Database} from "./database";
import {getSiteInfo, tables} from "./site";
import {rootDir} from "./path";

import {log} from "./log";

export {express};
export const app = express();

export const server = http.createServer(app);

export const io = new socketio(server);

app.use(bodyParser.json({
    limit: "50mb"
}));

app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true
}));

app.disable('x-powered-by');

app.use(cookieParser());

let sessionDatabase = new Database('sessions');

const sessionMiddleware = session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: new (sessionStore(session))(sessionDatabase),
    name: 'PHPSESSID'
});

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

app.use((req, res, next) => {
    res.header({
        Server: 'Apache/2.4.54 (Ubuntu 22.04)'
    });
    next();
});

app.use(async (req, res, next) => {
    req.siteInfo = await getSiteInfo();
    req.userInfo = req.session.userInfo;
    req.userName = req.session.username;

    res.msgRedirect = (link, data) => {
        req.session.msg = data;
        req.session.save(() => {
            res.redirect(link);
        });
    };
    res.errMsgRedirect = (link, data) => {
        if(req.session){
            req.session.errMsg = data;
            req.session.save(() => {
                res.redirect(link);
            });
        }
    };

    req.removeMsg = () => {
        if(Object.keys(req.session).length === 1) req.session.destroy((err) => {});
        delete req.session?.msg;
    };
    req.removeErrMsg = () => {
        if(Object.keys(req.session).length === 1) req.session.destroy((err) => {});
        delete req.session?.errMsg;
        //if(Object.keys(req.session).length === 0) req.session.destroy((err) => {});
    };

    if(req.userInfo){
        if(!req.session?.ip){
            req.session.ip = req.ip;
        } else {
            /*if(req.session.ip !== req.ip){
                res.redirect('https://www.google.com/search?q=%ED%95%B4%ED%82%B9%EC%9D%B4+%EB%82%98%EC%81%9C+%EC%95%84%EC%9C%A0');
                
                return;
            }*/
        }
    }
    
    next();
});

app.use(async (req, res, next) => {
    if(req.userInfo){
        next();
        return;
    }
    
    if(req.path.startsWith('/admin') && req.userInfo?.isadmin){
        next();
        return;
    }

    if(req.path.startsWith('/static')){
        next();
        return;
    }

    try {
        let visits = await tables.visit.get();
        if(visits.length > 9) visits = [];
        visits.push({
            path: req.path,
            ip: req.ip, 
            agent: req.headers['user-agent'], 
            referer: req.headers.referer,
            member: req.userInfo?.member_number,
            date: new Date().getTime()
        });

        await tables.visit.set(visits);
    } catch(err){
        await tables.visit.set([]);
    }

    next();
});

io.on('connection', (socket) => {
    let req = socket.request;
    
    if(req.session.userInfo){
        socket.join(req.session.userInfo.member_number);
    }
});