/**
 * Transforms root element: adds required attributes
 */
module.exports = function(node) {
	if (node.name === 't:style' && !node.parent) {
		node.attribs['xmlns'] = 'http://www.w3.org/1999/xhtml';
		node.attribs['xmlns:t'] = 'http://inn.ru/template';
		node.attribs['xmlns:xsl'] = 'http://www.w3.org/1999/XSL/Transform';
	}

	return node;
};