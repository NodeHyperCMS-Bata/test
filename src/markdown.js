import marked from "marked";
import insane from "insane";

import {mangle} from "marked-mangle";
import {gfmHeadingId} from "marked-gfm-heading-id";

marked.use(mangle());

marked.use(gfmHeadingId({
	prefix: "markdown-h-",
}));

const renderer = {
	heading(text, level){
		const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
	
		return `
			<${level+1 > 6 ? 'b' : 'h'+(level+1)}>
				<a name="${escapedText}" class="anchor" href="#${escapedText}">
					<span class="header-link"></span>
				</a>
				${text}
			</${level+1 > 6 ? 'b' : 'h'+(level+1)}>`;
	}
};
  
marked.use({renderer});
function markdown(md){
	return marked.parse(insane(md.replace(/	/g, '    '), {
		"allowedAttributes": {
			"a": ["href", "name", "target", "class"],
			"iframe": ["allowfullscreen", "frameborder", "width", "height", "src", "class"],
			"img": ["src", "class"]
		}
	}));
}

export default markdown;