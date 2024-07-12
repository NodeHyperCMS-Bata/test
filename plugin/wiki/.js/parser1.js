/*
 * namumark.php - Namu Mark Renderer
 * Copyright (C) 2015 koreapyj koreapyj0@gmail.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * :::::::::::: ORIGINAL CODE: koreapyj, 김동동(1st edited) ::::::::::::
 * :::::::::::::::::::::: 2nd Edited by PRASEOD- ::::::::::::::::::::::
 * 코드 설명 주석 추가: PRASEOD-
 * 설명 주석이 +로 시작하는 경우 PRASEOD-의 2차 수정 과정에서 추가된 코드입니다.
 *
 * ::::::::: 변경 사항 ::::::::::
 * 카카오TV 영상 문법 추가 [나무위키]
 * 문단 문법 미작동 문제 수정
 * 일부 태그 속성 수정
 * 글씨크기 관련 문법 수정
 * {{{#!wiki }}} 문법 오류 수정
 * anchor 문법 추가
 * 테이블 파서 재설계
 * 수평선 문법 미작동 및 개행 오류 수정
 * <nowiki>, <pre> 태그 <code>로 대체
 * 취소선 태그 <s>에서 <del>로 변경
 * 본문 영역 문단별 <div> 적용
 * 접힌목차 기능 추가
 */

const docs = require('./docs');

class PlainWikiPage {
    // 평문 데이터 호출
    constructor(text){
        this.title = '(inline wikitext)';
        this.text = text;
        this.lastchanged = new Date().getTime();
    }
}
class NamuMark {
    constructor(wtext){
        // 문법 데이터 생성
        this.list_tag = [
            ['*', 'ul data-pressdo-ul'],
            ['1.', 'ol data-pressdo-ol data-pressdo-ol-numeric'],
            ['A.', 'ol data-pressdo-ol data-pressdo-ol-capitalised'],
            ['a.', 'ol data-pressdo-ol data-pressdo-ol-alphabetical'],
            ['I.', 'ol data-pressdo-ol data-pressdo-ol-caproman'],
            ['i.', 'ol data-pressdo-ol data-pressdo-ol-lowroman']
        ];

        this.h_tag = [
            ['/^======#? (.*) #?======/', 6],
            ['/^=====#? (.*) #?=====/', 5],
            ['/^====#? (.*) #?====/', 4],
            ['/^===#? (.*) #?===/', 3],
            ['/^==#? (.*) #?==/', 2],
            ['/^=#? (.*) #?=/', 1]
        ];

        this.multi_bracket = [
            {
                'open': '{{{',
                'close': '}}}',
                'multiline': true,
                'processor': this.renderProcessor
            }
        ];

        this.single_bracket = [
            {
                'open': '{{{',
                'close': '}}}',
                'multiline': false,
                'processor': this.textProcessor
            },
            {
                'open': '[[',
                'close': ']]',
                'multiline': false,
                'processor': this.linkProcessor
            },
            {
                'open': '[',
                'close': ']',
                'multiline': false,
                'processor': this.macroProcessor
            },
            {
                'open': '\'\'\'',
                'close': '\'\'\'',
                'multiline': false,
                'processor': this.textProcessor
            },
            {
                'open': '\'\'',
                'close': '\'\'',
                'multiline': false,
                'processor': this.textProcessor
            },
            {
                'open': '**',
                'close': '**',
                'multiline': false,
                'processor': this.textProcessor
            },
            {
                'open': '~~',
                'close': '~~',
                'multiline': false,
                'processor': this.textProcessor
            },
            {
                'open': '--',
                'close': '--',
                'multiline': false,
                'processor': this.textProcessor
            },
            {
                'open': '__',
                'close': '__',
                'multiline': false,
                'processor': this.textProcessor
            },
            {
                'open': '^^',
                'close': '^^',
                'multiline': false,
                'processor': this.textProcessor
            },
            {
                'open': ',,',
                'close': ',,',
                'multiline': false,
                'processor': this.textProcessor
            }
        ];

        this.cssColors = [
            'black','gray','grey','silver','white','red','maroon','yellow','olive','lime','green','aqua','cyan','teal','blue','navy','magenta','fuchsia','purple',
            'dimgray','dimgrey','darkgray','darkgrey','lightgray','lightgrey','gainsboro','whitesmoke',
            'brown','darkred','firebrick','indianred','lightcoral','rosybrown','snow','mistyrose','salmon','tomato','darksalmon','coral','orangered','lightsalmon',
            'sienna','seashell','chocolate','saddlebrown','sandybrown','peachpuff','peru','linen','bisque','darkorange','burlywood','anaatiquewhite','tan','navajowhite',
            'blanchedalmond','papayawhip','moccasin','orange','wheat','oldlace','floralwhite','darkgoldenrod','goldenrod','cornsilk','gold','khaki','lemonchiffon',
            'palegoldenrod','darkkhaki','beige','ivory','lightgoldenrodyellow','lightyellow','olivedrab','yellowgreen','darkolivegreen','greenyellow','chartreuse',
            'lawngreen','darkgreen','darkseagreen','forestgreen','honeydew','lightgreen','limegreen','palegreen','seagreen','mediumseagreen','springgreen','mintcream',
            'mediumspringgreen','mediumaquamarine','aquamarine','turquoise','lightseagreen','mediumturquoise','azure','darkcyan','darkslategray','darkslategrey',
            'lightcyan','paleturquoise','darkturquoise','cadetblue','powderblue','lightblue','deepskyblue','skyblue','lightskyblue','steelblue','aliceblue','dodgerblue',
            'lightslategray','lightslategrey','slategray','slategrey','lightsteelblue','comflowerblue','royalblue','darkblue','ghostwhite','lavender','mediumblue',
            'midnightblue','slateblue','darkslateblue','mediumslateblue','mediumpurple','rebeccapurple','blueviolet','indigo','darkorchid','darkviolet','mediumorchid',
            'darkmagenta','plum','thistle','violet','orchid','mediumvioletred','deeppink','hotpink','lavenderblush','palevioletred','crimson','pink','lightpink'
        ];

        this.videoURL = {
            'youtube': '//www.youtube.com/embed/',
            'kakaotv': '//tv.kakao.com/embed/player/cliplink/',
            'nicovideo': '//embed.nicovideo.jp/watch/',
            'navertv': '//tv.naver.com/embed/',
            'vimeo': '//player.vimeo.com/video/'
        };

        this.macro_processors = [];
        this.WikiPage = wtext;
        this.imageAsLink = false;
        this.wapRender = false;
        this.toc = [];
        this.fn = [];
        this.category = [];
        this.links = [];
        this.fn_cnt = 0;
        this.prefix = '';
    }
    includePage(title){
        return new PlainWikiPage(docs.getWikiDoc(title).content);
    }
    pageExists(title){
        return new PlainWikiPage(docs.getWikiDoc(title)?.content);
    }
    toHtml(){ // 문법을 HTML로 변환하는 함수
        if(this.WikiPage.title === '') return '';

        this.whtml = this.WikiPage.text;
        const htmlScan = this.htmlScan(this.whtml);
        if(typeof htmlScan === "object"){
            return htmlScan;
        }
        this.whtml = htmlScan;
        return {type: 'html', value: `<div data-pressdo-doc-paragraph>${this.whtml}</div>`};
    }
    htmlScan(text){
        let result = '';
        const len = text.length;
        let now = '';
        let line = '';
        // 리다이렉트 문법
        if(text.startsWith('#') && text.match(/^#(?:redirect|넘겨주기) (.+)$/im) && this.inThread !== false){
            this.links.push({'target': target[1], 'type': 'redirect'});

            return {type: 'redirect', value: target[1]};
        }

        // 문법 처리 순서: 리스트 > 인용문 > 삼중괄호 > 표 >
        for(let i = 0; i < len && i >= 0; i++){
            now = text.charAt(i);

            // + 백슬래시 문법
            if(now === "\\"){
                i++;
                line += text.charAt(i);
                i++;
                now = text.charAt(i);
            }

            if(line === '' && now === ' ' && (list = this.listParser(text, i))){
                result += list;
                line = '';
                now = '';
                continue;
            }

            // 인용문
            /*if(line === '' && text.startsWith('&gt;', i) && (blockquote = this.bqParser(text, i))){
                result += blockquote;
                line = '';
                now = '';
                continue;
            }*/

            for(const bracket of this.multi_bracket){
                if(text.startsWith(bracket.open, i) && (innerstr = this.bracketParser(text, i, bracket))){
                    result += this.lineParser(line) + innerstr;
                    line = '';
                    now = '';
                    break;
                }
            }

            // 표
            if(line === '' && text.startsWith('|', i) && (table = this.tableParser(text, i))){
                result += table;
                line = '';
                now = '';
                continue;
            }

            if(now === "\n"){ // line parse
                result += this.lineParser(line);
                line = '';
            } else line += htmlspecialchars(now);
        }

        if(line !== '') result += this.lineParser(line);

        result += this.printFootnote();

        // 분류 모음
        // + HTML 구조 약간 변경함
        if(this.category.length !== 0 && this.inThread !== false){
            result += '<div id="categories" class="wiki-categories">' +
                      '<h2>분류</h2>' +
                      '<ul>';

            for(const category of this.category){
                result += '<li class="wiki-categories">' + this.linkProcessor(':분류:' + category + '|' + category, '[[') + '</li>';
            }
            result += '</ul></div>';
        }

        return result;
    }
    bqParser(text, offset){
        return text;
    }
    endsWith(haystack, needle){
        // search forward starting from end minus needle length characters
        return needle === "" || ((temp = haystack.length - needle.length) >= 0 && haystack.indexOf(needle, temp) !== -1);
    }
    tableParser(text, offset){
        let token = {caption: null, colstyle: [], rows: []};
        let tableinit = true;
        let tableAttr = [];
        let tdAttr = [];
        let tableattrinit = [];
        let tableAttrStr = '';
        let trAttrStr = '';
        let tableInnerStr = '';
        let trInnerStr = '';
        let tdInnerStr = '';
        let tdAttrStr = '';
        let len = text.length;
        let i = offset;
        let noheadmark = true;
        let intd = true;
        let rowIndex = 0;
        let colIndex = 0;
        let hasCaption = false;
        let chpos = (now, i) => {
            if(now.length > 1){
                i += now.length - 1;
            }
        };

        // caption 파싱은 처음에만
        if(text.startsWith('|', i) && !text.startsWith('||', i) && tableinit === true){
            let caption = text.substr(i).split('|');
            if(caption.length < 3) return false;
            token.caption = this.blockParser(caption[1]);
            hasCaption = true;
            tableinit = false;
            //   (|)   (caption content)   (|)
            i += 1 + caption[1].length + 1;
        } else if(text.startsWith('||', i) && tableinit === true){
            i += 2;
            hasCaption = false;
            tableinit = false;
        } else if(tableinit === true) return false;
        // text 변수에는 표 앞부분의 ||가 제외된 상태의 문자열이 있음
        /*
        * DOM 구조
        {
            table:[
                'caption': 'caption',
                'colstyles' => []
                'rows' => [
                    [
                        'style' => ['style' => 'style'],
                        'cols' => [
                            ['text' => blockParser, 'style' => ['style' => 'style'], 'rowspan' => 1],
                            'span',
                            [...]
                        ]
                    ],
        */
        for(; i < len; i++){
            let now = text.charAt(i);
            //+ 백슬래시 문법
            if(now == "\\"){
                ++i;
                tdInnerStr += text.charAt(i);
                chpos(now, i);
                continue;
            } else if(noheadmark === false && tdInnerStr == '' && now == ' ' && (list = this.listParser(text, i))){
                tdInnerStr += list;
                continue;
            } else if(text.startsWith('||', i)){
                if(intd === true){
                    //td end and new td start
                    token.rows[rowIndex].cols[colIndex] = { text: this.blockParser(tdInnerStr), style: tdAttr };
                    tdInnerStr = '';
                    ++colIndex;
                    ++i;
                    continue;
                } else if(intd === false){
                    // new td start
                    intd = true;
                    ++i;
                    continue;
                }
                continue;
            } else if(noheadmark === false && tdInnerStr == '' && text.startsWith('>', i) && (blockquote = this.bqParser(text, i))){
                tdInnerStr += blockquote;
                continue;
            } else if(tdInnerStr == '' && text.startsWith('<', i) && (match = /^<([^ ]+)>/.exec(text.substr(i, this.seekEndOfLine(text, i) - i)))){
                let attrs = match[1].split('><');
                attrs.forEach(function(attr){
                    attr = attr.toLowerCase();
                    let tbattr = /^([^=]*)=([^=]*)$/.exec(attr);
                    if(tbattr){
                        // 속성은 최초 설정치가 적용됨
                        if(
                            !tableattrinit.includes(tbattr[1].replace(/ /g, '')) && (
                                (['tablealign', 'table align'].includes(tbattr[1]) && ['center', 'left', 'right'].includes(tbattr[2])) ||
                                (['tablewidth', 'table width'].includes(tbattr[1]) && /^-?[0-9.]*(px|%)$/.test(tbattr[2])) || 
                                (['tablebgcolor', 'table bgcolor', 'tablecolor', 'table color', 'tablebordercolor', 'table bordercolor'].includes(tbattr[1]) && (this.cssColors.includes(tbattr[2]) || /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(tbattr[2])))
                            )
                        ){
                            // 표 속성
                            i += tbattr[0].length + 8;
                            tableattrinit.push(tbattr[1].replace(/ /g, ''));
                            switch(tbattr[1].replace(/ /g, '')){
                                case 'tablebgcolor':
                                    tbAttrNm = 'background-color';
                                    break;
                                case 'tablecolor':
                                    tbAttrNm = 'color';
                                    break;
                                case 'tablebordercolor':
                                    tbAttrNm = 'border-color';
                                    break;
                                case 'tablebgcolor':
                                    tbAttrNm = 'background-color';
                                    break;
                                case 'tablewidth':
                                    tbAttrNm = 'width';
                                    break;
                                default:
                                    tbAttrNm = tbattr[1];
                            }
                            if(['tablealign', 'table align'].includes(tbattr[1]))
                                tbClassStr = ' table-'+tbattr[2];
                            else
                                tableAttr[tbAttrNm] = tbattr[2];
                        } else if(
                            // 개별 행 속성
                            ['rowbgcolor', 'rowcolor'].includes(tbattr[1]) && 
                            (this.cssColors.includes(tbattr[2]) || /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(tbattr[2]))
                        ){
                            i += tbattr[0].length + 8;
                            switch(tbattr[1]){
                                case 'rowbgcolor':
                                    tbAttrNm = 'background-color';
                                    break;
                                case 'rowcolor':
                                    tbAttrNm = 'color';
                                    break;
                                default:
                                    tbAttrNm = tbattr[1];
                            }
                            token.rows[rowIndex].style[tbAttrNm] = tbattr[2];
                        } else if(
                            // 개별 열 속성
                            ['colbgcolor', 'colcolor'].includes(tbattr[1]) && 
                            (this.cssColors.includes(tbattr[2]) || /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(tbattr[2]))
                        ){
                            i += tbattr[0].length + 8;
                            switch(tbattr[1]){
                                case 'colbgcolor':
                                    tbAttrNm = 'background-color';
                                    break;
                                case 'colcolor':
                                    tbAttrNm = 'color';
                                    break;
                                default:
                                    tbAttrNm = tbattr[1];
                            }
                            token.colstyle[colIndex][tbAttrNm] = tbattr[2];
                        } else if(
                            // 개별 셀 속성
                            (['width', 'height'].includes(tbattr[1]) && /^-?[0-9.]*(px|%)$/.test(tbattr[2])) ||
                            (['color', 'bgcolor'].includes(tbattr[1]) && (this.cssColors.includes(tbattr[2]) || /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(tbattr[2])))
                        ){
                            i += tbattr[0].length + 8;
                            switch(tbattr[1]){
                                case 'bgcolor':
                                    tbAttrNm = 'background-color';
                                    break;
                                default:
                                    tbAttrNm = tbattr[1];
                            }
                            tdAttr[tbAttrNm] = tbattr[2];
                        }
                    } else if((tbspan = /^(-|\|)([0-9]*)$/.exec(attr))){
                        i += tbspan[0].length + 8;
                        // <^|n>
                        if(tbspan[1] == '-')
                            rowspan = tbspan[2];
                        else if(tbspan[1] == '|')
                            tdAttr['colspan'] = tbspan[2];
                    } else if((tbalign = /^(\^|v|)\|([0-9]*)$/.exec(attr))){
                        i += tbalign[0].length + 8;
                        // <^|n>
                        if(tbalign[1] == '^')
                            tdAttr['vertical-align'] = 'top';
                        else if(tbalign[1] == 'v')
                            tdAttr['vertical-align'] = 'bottom';
                        rowspan = tbalign[2];
                    } else {
                        // <:>
                        switch(attr){
                            case ':':
                                tdAttr['text-align'] = 'center';
                                i += 11;
                                break;
                            case '(':
                                tdAttr['text-align'] = 'left';
                                i += 11;
                                break;
                            case ')':
                                tdAttr['text-align'] = 'right';
                                i += 11;
                        }
                    }
                });
            } else {
                // bracket
                for(let j = 0; j < this.multi_bracket.length; j++){
                    let bracket = this.multi_bracket[j];
                    if(text.startsWith(bracket.open, i) && (innerstr = this.bracketParser(text, i, bracket))){
                        tdInnerStr += this.lineParser(tdInnerStr)+innerstr;
                        continue;
                    }
                }
                //+ \r과 \r\n 모두에서 작동할 수 있도록 함.
                if((text.startsWith("\r\n||", i) || text.startsWith("\n||", i)) && tdInnerStr == ''){
                    ++rowIndex;
                    colIndex = 0;
                    noheadmark = true;
                    intd = false;
                } else if((text.startsWith("\r\n", i) || text.startsWith("\n", i)) && text.charAt(i+1) !== '|' && tdInnerStr == ''){
                    ++i;
                    break;
                } else if(text.startsWith("\r\n", i) || text.startsWith("\n", i)){
                    // just breaking line
                    tdInnerStr += now;
                    noheadmark = false;
                } else {
                    // other string
                    tdInnerStr+=now;
                    noheadmark = true;
                }
            }
            chpos(now, i);
        }
        for(let r = 0; r < token.rows.length; r++){
            if(!Array.isArray(token.rows[r])) return false;
            for(let rc = 0; rc < token.rows[r].cols.length; rc++){
                let rc = token.rows[r].cols[rc];
                if(rc == 'span') continue;
                if(!Object.keys(rc.style).length){
                    let rcCount = Object.keys(rc.style).length;
                    let rcKeys = Object.keys(rc.style);
                    for(let k = 0; k < rcCount; ++k){
                        if(k !== 0) tdAttrStr += ' ';
                        tdAttrStr += rcKeys[k]+':'+rc.style[rcKeys[k]]+';';
                    }
                }
                if(tdAttrStr.length > 0) tdAttrStr = ' style="'+tdAttrStr+'"';
                if(rc.rowspan) tdAttrStr += ' rowspan="'+rc.rowspan+'"';
                if(rc.colspan) tdAttrStr += ' colspan="'+rc.colspan+'"';
                trInnerStr += `<td${tdAttrStr}>${rc.text}</td>`;
                tdAttrStr = '';
            }
            
            if(Object.keys(r.style).length){
                let attrlen = Object.keys(r.style).length;
                let attkeys = Object.keys(r.style);
                for(let k = 0; k < attrlen; k++){
                    trAttrStr += attkeys[k]+':'+r.style[attkeys[k]]+'; ';
                }
            }

            if(trAttrStr.length > 0) trAttrStr = ' style="'+trAttrStr+'"';
            tableInnerStr += '<tr'+trAttrStr+'>'+trInnerStr+'</tr>';
            trInnerStr = trAttrStr = '';
        }
        let attrlen = Object.keys(tableAttr).length;
        let attkeys = Object.keys(tableAttr);
        for(let k = 0; k < attrlen; k++){
            tableAttrStr += attkeys[k]+':'+tableAttr[attkeys[k]]+'; ';
        }
        if(tableAttrStr.length > 0) tableAttrStr = ' style="'+tableAttrStr+'"';
        if(!tbClassStr) tbClassStr = '';
        offset = i;
        return '<div class="wiki-table-wrap'+tbClassStr+'"><table class="wiki-table" '+tableAttrStr+'>'+tableInnerStr+'</table></div>';
    }
    listParser(text, offset){ // 리스트 생성
        let listTable = [];
        let len = text.length;
        let lineStart = offset;
        let quit = false;
        for(let i = offset; i < len; before = nextChar(text, i)){
            let now = text.charAt(i);
            if(now == "\n" && !listTable[0]) return false;
            if(now != ' '){
                if(lineStart === i){
                    // list end
                    break;
                }
                let match = false;
                for(let j = 0; j < this.list_tag.length; j++){
                    let list_tag = this.list_tag[j];
                    if(text.startsWith(list_tag[0], i)){
                        if(listTable[0] && listTable[0].tag=='indent'){
                            i = lineStart;
                            quit = true;
                            break;
                        }
                        let eol = this.seekEndOfLine(text, lineStart);
                        let tlen = list_tag[0].length;
                        let innerstr = text.substr(i+tlen, eol-(i+tlen));
                        this.listInsert(listTable, innerstr, (i-lineStart), list_tag[1]);
                        i = eol;
                        now = "\n";
                        match = true;
                        break;
                    }
                }
                if(quit) break;
                if(!match){
                    // indent
                    if(listTable[0] && listTable[0].tag!='indent'){
                        i = lineStart;
                        break;
                    }
                    let eol = this.seekEndOfLine(text, lineStart);
                    let innerstr = text.substr(i, eol-i);
                    this.listInsert(listTable, innerstr, (i-lineStart), 'indent');
                    i = eol;
                    now = "\n";
                }
            }
            if(now == "\n"){
                lineStart = i+1;
            }
        }
        if(listTable[0]){
            offset = i-1;
            return this.listDraw(listTable);
        }
        return false;
    }
}


