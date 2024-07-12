module.exports = () => {
    const SINGLE_CHAR_TOKENS = [
        '\n', '[', ']', '*'
    ];

    const DOUBLE_CHAR_TOKENS = [
        '[[', ']]', '\'\'', '**', '~~', '--', '__', '^^', ',,', '||',
        '1.', 'a.', 'A.', 'i.', 'I.'
    ];

    const TRIPLE_CHAR_TOKENS = [
        '{{{', '}}}', '\'\'\'', '```'
    ];

    const QUADRUPLE_CHAR_TOKENS = [
        '----'
    ];

    const SPECIAL_TOKENS_9 = [
        '{{{#!wiki', '{{{#!html'
    ];

    const TOKEN_TYPE = {
        string: 'string',
        grammar: 'grammar',
        special: 'special',
        paragraph: 'paragraph'
    };

    const CSS_COLOR = [
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

    function tokenizer(input){
        let cursor = 0;
        let token = '';
        let tokens = [];

        function previousTokenPush(){
            if(token !== ''){
                tokens.push({value: token, type: TOKEN_TYPE.string});
            }
            token = '';
        }

        for(; cursor < input.length; cursor++){
            let char = input[cursor], now_token;

            if(SPECIAL_TOKENS_9.includes(now_token = input.slice(cursor, cursor+9))){
                previousTokenPush();
                tokens.push({value: now_token, type: TOKEN_TYPE.special});
                cursor += 9;
            } else if(QUADRUPLE_CHAR_TOKENS.includes(now_token = input.slice(cursor, cursor+4))){
                previousTokenPush();
                tokens.push({value: now_token, type: TOKEN_TYPE.grammar});
                cursor += 3;
            } else if(TRIPLE_CHAR_TOKENS.includes(now_token = input.slice(cursor, cursor+3))){
                previousTokenPush();
                tokens.push({value: now_token, type: TOKEN_TYPE.grammar});
                cursor += 2;
            } else if(DOUBLE_CHAR_TOKENS.includes(now_token = input.slice(cursor, cursor+2))){
                previousTokenPush();
                tokens.push({value: now_token, type: TOKEN_TYPE.grammar});
                cursor++;
            } else if(SINGLE_CHAR_TOKENS.includes(char)){
                previousTokenPush();
                tokens.push({value: char, type: TOKEN_TYPE.grammar});
            } else if(char === '='){
                let level = 0;
                let folded = false;

                let new_cursor = cursor;

                while(input[new_cursor] === '='){
                    level++;
                    new_cursor++;
                }

                if(input[new_cursor] === '#'){
                    folded = true;
                    new_cursor++;
                } 
                
                if(input[new_cursor] === ' '){
                    previousTokenPush();

                    cursor = new_cursor;

                    tokens.push({value: level, folded: folded, type: TOKEN_TYPE.paragraph});
                } else {
                    token += char;
                }
            } else if(char === ' '){
                let level = 0;
                let folded = false;

                let new_cursor = cursor;

                new_cursor++;

                if(input[new_cursor] === '#'){
                    folded = true;
                    new_cursor++;
                } 

                while(input[new_cursor] === '='){
                    level++;
                    new_cursor++;
                }
                
                if(level > 0){
                    previousTokenPush();

                    cursor = new_cursor;

                    tokens.push({value: level, folded: folded, type: TOKEN_TYPE.paragraph});
                } else {
                    token += char;
                }
            } else {
                token += char;
            }
        }
        previousTokenPush();

        return tokens;
    }

    function parser(tokens){
        let ast = [];
        let cursor = 0;

        function single_bracket_parser(bracket, type){
            if(tokens[cursor].value === bracket){
                cursor++;
                const node = {
                    type,
                    items: new Array()
                };

                while(tokens[cursor] && (tokens[cursor].type !== TOKEN_TYPE.grammar || tokens[cursor].value !== bracket)){
                    node.items.push(walk());
                }

                cursor++;

                return node;
            }
        }

        function walk(obj = {}){
            const token = tokens[cursor];
            
            if(token.type === TOKEN_TYPE.grammar){
                let parse;

                parse = single_bracket_parser("'''", 'bold');
                if(parse) return parse;
                parse = single_bracket_parser("''", 'italics');
                if(parse) return parse;
                parse = single_bracket_parser("__", 'underscore');
                if(parse) return parse;
                parse = single_bracket_parser("~~", 'strikethrough');
                if(parse) return parse;
                parse = single_bracket_parser("^^", 'superscript');
                if(parse) return parse;
                parse = single_bracket_parser(",,", 'subscript');
                if(parse) return parse;
                
                if(token.value === '{{{'){
                    let node = {type: 'literal'};

                    cursor++;

                    if(tokens[cursor].type === TOKEN_TYPE.string){
                        node.items = [{type: 'string', value: tokens[cursor].value}];
                        
                        const splitStr = tokens[cursor].value.split(' ');

                        if(tokens[cursor+1].type !== TOKEN_TYPE.grammar || tokens[cursor+1].value !== '}}}'){
                            if(!isNaN(+splitStr[0])){
                                node = {
                                    type: 'size', 
                                    value: +splitStr[0], 
                                    items: [
                                        {type: 'string', value: splitStr.slice(1).join(' ')}
                                    ]
                                };
                            } else if(splitStr[0].startsWith('#')){
                                node = {
                                    type: 'color', 
                                    value: '', 
                                    items: [
                                        {type: 'string', value: splitStr.slice(1).join(' ')}
                                    ]
                                };

                                if(CSS_COLOR.includes(splitStr[0].slice(1))) node.value = splitStr[0].slice(1);
                                else node.value = splitStr[0];
                            }
                        }

                        if(node.items[0].value === '') node.items.shift();

                        cursor++;
                    }

                    if(node.type === 'literal') node.value = '';
            
                    while(tokens[cursor] && (tokens[cursor].type !== TOKEN_TYPE.grammar || tokens[cursor].value !== '}}}')){
                        if(node.type === 'literal'){
                            node.value += tokens[cursor].value;
                            cursor++;
                        }
                        else node.items.push(walk());
                    }
            
                    cursor++;
            
                    return node;
                }
                if(token.value === '[['){
                    cursor++;

                    const splitStr = tokens[cursor].value.split('|');

                    if(splitStr[0].startsWith('파일:')){
                        const node = {
                            type: 'file', 
                            value: splitStr[0].slice(3), 
                            params: splitStr[1]?.split('&') || []
                        };
        
                        cursor++;
                        cursor++;
                
                        return node;
                    } else if(splitStr[0].startsWith('분류:')){
                        const node = {
                            type: 'categorie', 
                            value: splitStr.join('|').slice(3)
                        };
        
                        cursor++;
                        cursor++;
                
                        return node;
                    } else {
                        const node = {
                            type: 'hyperlink', 
                            value: splitStr[0], 
                            items: [
                                {type: 'string', value: splitStr.slice(1).join('|')}
                            ]
                        };
        
                        if(node.items[0].value === '') node.items.shift();
        
                        cursor++;
        
                        while(tokens[cursor] && (tokens[cursor].type !== TOKEN_TYPE.grammar || tokens[cursor].value !== ']]')){
                            node.items.push(walk());
                        }
        
                        if(node.items.length === 0) node.items.push({type: 'string', value: splitStr[0]});
                
                        cursor++;
                
                        return node;
                    }
                }
                if(token.value === '----'){
                    cursor++;

                    const node = {
                        type: 'divide'
                    };
        
                    cursor++;
        
                    return node;
                }
                if(token.value === '```'){
                    cursor++;

                    const node = {
                        type: 'code',
                        value: ''
                    };

                    while(tokens[cursor] && (tokens[cursor].type !== TOKEN_TYPE.grammar || tokens[cursor].value !== '```')){
                        node.value += tokens[cursor].value;
                        cursor++;
                    }
            
                    cursor++;
            
                    return node;
                }
            }
            if(token.type === TOKEN_TYPE.special){
                if(token.value === '{{{#!wiki'){

                }
                if(token.value === '{{{#!html'){
                    cursor++;

                    const node = {
                        type: 'html',
                        value: ''
                    };

                    while(tokens[cursor] && (tokens[cursor].type !== TOKEN_TYPE.grammar || tokens[cursor].value !== '}}}')){
                        node.value += tokens[cursor].value;
                        cursor++;
                    }
            
                    cursor++;
            
                    return node;
                }
            }
            if(token.type === TOKEN_TYPE.paragraph){
                const node = {
                    type: 'paragraph', 
                    value: token.value,
                    folded: token.folded,
                    items: new Array()
                }

                cursor++;

                while(tokens[cursor] && (
                    tokens[cursor].type !== TOKEN_TYPE.paragraph || 
                    tokens[cursor].value !== token.value || 
                    tokens[cursor].folded !== token.folded
                )){
                    node.items.push(walk());
                }

                cursor++;

                return node;
            }
            if(token.type === TOKEN_TYPE.string){
                const node = {
                    type: 'string', 
                    value: token.value
                };

                cursor++;

                return node;
            }

            const node = {
                type: 'string', 
                value: token.value
            };

            cursor++;

            return node;
        }

        while(cursor < tokens.length){
            let target;
            if(tokens[cursor].type === 'string' && tokens[cursor].value.startsWith('#') && (target = tokens[cursor].value.match(/^#(?:redirect|넘겨주기) (.+)$/im))){
                return {type: 'redirect', value: target[1]};
            }
            ast.push(walk());
        } 

        return {
            type: 'markup',
            items: ast
        };
    }
    return string => parser(tokenizer(string));
};