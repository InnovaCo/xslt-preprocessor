/**
 * "if" attribute transformer: wraps element that contains "if" attribute
 * with <xsl:if> element
 */
var utils = require('../utils');
var expression = require('expression-parser');

function normalizeCondition(cond) {
	var token = expression.parse(cond)[0];
	return (token && token.xpathCondition) || cond;
}

module.exports = function(node) {
	if (utils.isTag(node) && 'if' in node.attribs) {
		var wrapper = utils.makeDom('<xsl:if test="' + normalizeCondition(node.attribs['if']) + '"></xsl:if>')[0];
		utils.wrap(node, wrapper);
		delete node.attribs['if'];
	}

	return node;
};