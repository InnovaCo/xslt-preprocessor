/**
 * Transforms root element: adds required attributes
 */
var utils = require('../utils');

module.exports = function(node) {
	if (utils.localName(node) === 'template' && !node.parent) {
		node.attribs['xmlns'] = 'http://www.w3.org/1999/xhtml';
		node.attribs['xmlns:t'] = 'http://inn.ru/template';
		node.attribs['xmlns:xsl'] = 'http://www.w3.org/1999/XSL/Transform';
	}

	return node;
};