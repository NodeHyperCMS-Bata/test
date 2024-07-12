import {tables, getUserInfo, setUserInfo, changeUserName, addMember, changeMemberData, getMemberNumber} from "./site";
import {password_hash_check} from "./password";
import {getPageUrlsAwait} from './pages';
import {Router} from './router';
import {log} from './log';

const router = new Router();

let pageUrls = getPageUrlsAwait();

router.receive(pageUrls.api_signin, async (req, res) => {
    if(!req.session?.isLogined){
        let username, password;
        if((username = req.body?.username) && (password = req.body?.password)){
            let memberNumber, userInfo;
            if(userInfo = await getUserInfo((memberNumber = await getMemberNumber(username)))){
                if(await password_hash_check(password, userInfo.hash) == userInfo.password){
                    req.session.username = username;
                    req.session.userInfo = userInfo;
                    req.session.isLogined = true;

                    if(userInfo.isadmin) log(`Administrator logged in, ${username}: ${req.ip}.`, 'log');
    
                    res.msgRedirect('/', {type: 'success', msg: '성공적으로 로그인되었습니다!'});
                } else {
                    res.errMsgRedirect(pageUrls.signin, "아이디나 비밀번호가 틀렸습니다.");
                }
            } else {
                res.errMsgRedirect(pageUrls.signin, "아이디나 비밀번호가 틀렸습니다.");
            }
        } else {
            res.errMsgRedirect(pageUrls.signin, "정상적인 방식으로 로그인 해주세요.");
        }
    } else {
        res.errMsgRedirect('/', "이미 로그인되어 있습니다.");
    }
});

router.receive(pageUrls.api_signup, async (req, res) => {
    if(!req.session?.isLogined){
        let username, password;
        if((username = req.body?.username) && (password = req.body?.password)){
            if(!await getUserInfo(await getMemberNumber(username))){
                if(password != ''){
                    if(username != '' && !username.includes(' ') && !username.includes('"') && !username.includes("'") && !username.includes("/")){
                        let userInfo = await addMember(username, password, 1, false);
                        req.session.username = username;
                        req.session.userInfo = userInfo;
                        req.session.isLogined = true;
                        res.msgRedirect('/', {type: 'success', msg: '성공적으로 가입되었습니다!'});
                    } else {
                        res.errMsgRedirect(pageUrls.signup, "사용자 아이디는 ``이거나(아무 글자도 없음) ` `(빈칸) 또는 `\"`(큰 따옴표), `'`(작은 따옴표), '/'(슬러시)가 포함될 수 없습니다.");
                    }
                } else {
                    res.errMsgRedirect(pageUrls.signup, "비밀번호에서는 ''는 허용되지 않습니다.");
                }
            } else {
                res.errMsgRedirect(pageUrls.signup, "존재하는 아이디입니다.");
            }
        } else {
            res.errMsgRedirect(pageUrls.signup, "정상적인 방식으로 가입 해주세요.");
        }
    } else {
        res.errMsgRedirect('/', "이미 로그인되어 있습니다.");
    }
});

router.receive(pageUrls.signout, (req, res) => {
    res.redirect(pageUrls.api_signout);
});

router.receive(pageUrls.api_signout, (req, res) => {
    if(req.session?.isLogined){
        req.session.isLogined = false;
        delete req.session.ip;
        delete req.session.username;
        delete req.session.userInfo;
        
        res.msgRedirect('/', {type: 'success', msg: '성공적으로 로그아웃되었습니다. Bye~'});
    } else {
        res.msgRedirect('/', {type: 'danger', msg: '로그인되어 있지 않습니다.'});
    }
});


router.receive(pageUrls.api_settings, async (req, res) => {
    if(req.session?.isLogined){
        let username, password;

        if((username = req.body?.username) && (password = req.body?.password) || password === ''){
            if(!await getUserInfo(await getMemberNumber(username)) || username == req.session.username){
                if(username != '' && !username.includes(' ') && !username.includes('"') && !username.includes("'")){
                    let userInfo = await changeMemberData(req.session.userInfo, {password: password != '' ? password : null});
                    await setUserInfo(req.session.userInfo.member_number, userInfo);
                    await changeUserName(req.session.username, username);
                    req.session.username = username;
                    req.session.userInfo = userInfo;
                    req.session.isLogined = true;
                    res.msgRedirect(pageUrls.settings, {type: 'success', msg: '성공적으로 회원 정보가 수정되었습니다!'});
                } else {
                    res.errMsgRedirect(pageUrls.settings, "사용자 아이디는 ``이거나(아무 글자도 없음) ` `(빈칸) 또는 `\"`, `'`가 포함될 수 없습니다.");
                }
            } else {
                res.errMsgRedirect(pageUrls.settings, "존재하는 아이디입니다.");
            }
        } else {
            res.errMsgRedirect(pageUrls.settings, "정상적인 방식으로 설정 해주세요.");
        }
    } else {
        res.msgRedirect('/', {type: 'danger', msg: '로그인되어 있지 않습니다.'});
    }
});

export default router;