module.exports = ast => {
	const categories = [];

	let paragraphCount = 1;

    function walk(node){
        switch(node.type){
            case 'bold':
                return `<b>${node.items.map(walk).join('')}</b>`;
            case 'italics':
                return `<i>${node.items.map(walk).join('')}</i>`;
            case 'underscore':
                return `<u>${node.items.map(walk).join('')}</u>`;
            case 'strikethrough':
                return `<del>${node.items.map(walk).join('')}</del>`;
            case 'superscript':
                return `<sup>${node.items.map(walk).join('')}</sup>`;
            case 'subscript':
                return `<sub>${node.items.map(walk).join('')}</sub>`;
            case 'size':
                return `<span class="h${node.value}">${node.items.map(walk).join('')}</span>`;
            case 'color':
                return `<span style="color:${node.value};">${node.items.map(walk).join('')}</span>`;
            case 'literal':
                return `${node.value}`;
            case 'file':
                return `<img src="${node.value}" alt="${node.params.join(',')}"/>`;
            case 'categorie':
				categories.push(node.value);
                return ``;
            case 'hyperlink':
                return `<a href="${node.value}">${node.items.map(walk).join('')}</a>`;
            case 'divide':
                return `<hr />`;
            case 'code':
                return `<code>${node.value}</code>`;
            case 'html':
                return `${node.value}`;
            case 'paragraph':
				const paragraphNumber = `${paragraphCount++}.`; // 목차 항목 번호 생성
                return `<h${node.value}><a href="#wiki-toc">${paragraphNumber}</a> ${node.items.map(walk).join('')}</h${node.value}>`;
            case 'string':
                return node.value;
            default:
                return '';
        }
    }

    if(ast.type === 'redirect'){
        return {redirect: ast.value};
    }

	let html = ast.items.map(walk).join('').replace(/\n/gi, '<br />');
	

    return {html, categories};
};