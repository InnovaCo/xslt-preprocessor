/**
 * Text node transformer: searches for `{...}` fragments in
 * text and replaces them with <xsl:value-of/> element
 */
var expression = require('expression-parser');

module.exports = function(node) {
	if (node.type !== 'text') {
		return;
	}

	node.data = expression(node.data).map(function(token) {
		if (Array.isArray(token)) {
			return '<xsl:value-of select="' + token[0].value + '"/>';
		}

		return token;
	}).join('');
};