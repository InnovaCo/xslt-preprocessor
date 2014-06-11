/**
 * Process template invocatoin elements: <call-template> and <apply-templates>
 * Takes `param` attribute as a node-set and transforms it into a list of 
 * <xsl:with-param> elements
 */
var utils = require('../utils');
var expression = require('expression-parser');

module.exports = function(node) {
	if (!utils.isTemplateNode(node, 'call-template', 'apply-templates') || !node.attribs.params) {
		return;
	}

	var params = expression.parse(node.attribs.params);
	if (!expression.isNodeSet(params)) {
		throw new Error('Expected node-set in "params" attribute of <' + node.name + '> element but received "' + node.attribs.params + '"');
	}

	var fragment = params.map(function(param) {
		var out = '<xsl:with-param name="' + param.key + '"><xsl:value-of select="' + param.value + '"></xsl:value-of></xsl:with-param>';
		if (param.xpathCondition) {
			out = '<xsl:if test="' + param.xpathCondition + '">' + out + '</xsl:if>';
		}

		return out;
	}).join('\n');

	utils.prepend(node, utils.makeDom(fragment));
	delete node.attribs.params;
};