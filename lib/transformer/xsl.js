/**
 * Transforms XSL aliases to real XSL tags
 */
var utils = require('../utils');

var aliases = [
	'apply-imports', 'apply-templates', 'attribute', 'attribute-set',
	'call-template', 'choose', 'comment', 'copy', 'copy-of', 'decimal-format',
	'element', 'fallback', 'for-each', 'if', 'import', 'include', 'key', 'message',
	'namespace-alias', 'number', 'otherwise', 'output', 'param', 'preserve-space',
	'processing-instruction', 'sort', 'strip-space', 'stylesheet', 'template',
	'text', 'transform', 'value-of', 'variable', 'when', 'with-param'
];

module.exports = function(node) {
	if (!utils.isTag(node) || /^xsl:/.test(node.name)) {
		return;
	}

	aliases.some(function(alias) {
		if (utils.isTemplateNode(node, alias)) {
			node.name = 'xsl:' + alias;
			return true;
		}
	});
};