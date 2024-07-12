import insane from "insane";

export function HTMLencoding(html){
	return insane(html, {
		allowedTags: [
			"address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
			"h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
			"dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
			"ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "del", "data", "data", "details", "dfn",
			"em", "i", "img", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
			"small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
			"col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr"
		],
		allowedAttributes: {
			"a": [
				"href", 
				"name", 
				"target",
				"class",
				"style"
			],
			"article": [
				"class",
				"style"
			],
			"b": [
				"class",
				"style"
			],
			"blockquote": [
				"class",
				"style"
			],
			"br": [
				"class",
				"style"
			],
			"caption": [
				"class",
				"style"
			],
			"code": [
				"class",
				"style"
			],
			"del": [
				"class",
				"style"
			],
			"data": [
				"class",
				"style"
			],
			"details": [
				"class",
				"style"
			],
			"dfn": [
				"class",
				"style"
			],
			"div": [
				"class",
				"style"
			],
			"em": [
				"class",
				"style"
			],
			"h1": [
				"class",
				"style"
			],
			"h2": [
				"class",
				"style"
			],
			"h3": [
				"class",
				"style"
			],
			"h4": [
				"class",
				"style"
			],
			"h5": [
				"class",
				"style"
			],
			"h6": [
				"class",
				"style"
			],
			"hr": [
				"class",
				"style"
			],
			"i": [
				"class",
				"style"
			],
			"img": [
				"class",
				"style",
				"src"
			],
			"ins": [
				"class",
				"style"
			],
			"kbd": [
				"class",
				"style"
			],
			"li": [
				"class",
				"style"
			],
			"main": [
				"class",
				"style"
			],
			"ol": [
				"class",
				"style"
			],
			"p": [
				"class",
				"style"
			],
			"pre": [
				"class",
				"style"
			],
			"section": [
				"class",
				"style"
			],
			"span": [
				"class",
				"style"
			],
			"strike": [
				"class",
				"style"
			],
			"strong": [
				"class",
				"style"
			],
			"sub": [
				"class",
				"style"
			],
			"summary": [
				"class",
				"style"
			],
			"sup": [
				"class",
				"style"
			],
			"table": [
				"class",
				"style"
			],
			"tbody": [
				"class",
				"style"
			],
			"td": [
				"class",
				"style"
			],
			"th": [
				"class",
				"style"
			],
			"thead": [
				"class",
				"style"
			],
			"tr": [
				"class",
				"style"
			],
			"u": [
				"class",
				"style"
			],
			"ul": [
				"class",
				"style"
			]
		}
	});
}

export default HTMLencoding;