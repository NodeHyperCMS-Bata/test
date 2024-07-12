import markdown from "./markdown";
import insane from "insane";

function descriptionMarkdown(md){
	return insane(markdown(md), {
		"allowedAttributes": {
			"a": ["href", "name", "target", "class"],
			"iframe": ["allowfullscreen", "frameborder", "src", "class"],
			"img": ["src", "class"]
		},
		"allowedTags": [
			"a", "article", "b", "caption", "del", "div", "em", "code", "p",
			"i", "img", "ins", "kbd", "li", "section", "span", "strike", "strong", "u"
		]
	});
}

export default descriptionMarkdown;