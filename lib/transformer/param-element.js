/**
 * Transformer for <param> element: when used in <call-template> or <apply-templates>
 * element, renamed to <xsl:with-param>
 */
var utils = require('../utils');

module.exports = function(node) {
	if (!utils.isTemplateNode(node, 'param') || !node.parent) {
		return;
	}

	var paramNode = node;
	var names = ['xsl:call-template', 'xsl:apply-templates'];
	while (node.parent) {
		if (~names.indexOf(node.parent.name)) {
			return paramNode.name = 'xsl:with-param';
		}

		node = node.parent;
	}
};