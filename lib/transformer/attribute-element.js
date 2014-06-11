/**
 * <t:attr> | <t:attribute> transformer.
 * Unlike <xsl:attribute>, understands `value="..."` attribute,
 * which is a shorthand to <xsl:attribute><xsl-value-of select="..." /></xsl:attribute>
 */
var utils = require('../utils');
var expression = require('expression-parser');

function stringifyExpression(tokens) {
	return tokens.map(function(token) {
		if (token.xpathCondition) {
			return '<xsl:if test="' + token.xpathCondition + '"><xsl:value-of select="' + token.value + '" /></xsl:if>';
		}

		return '<xsl:value-of select="' + token.value + '"/>';
	});
}

module.exports = function(node) {
	if (!utils.isTemplateNode(node, 'attr', 'attribute')) {
		return;
	}

	if ('value' in node.attribs) {
		var tokens = expression(node.attribs.value);
		var value = tokens.map(function(token) {
			if (Array.isArray(token)) {
				return stringifyExpression(token);
			}

			return '<xsl:text>' + token + '</xsl:text>';
		}).join('\n');


		var varName = '__x_attr_' + node.attribs.name;

		var xsl = '<xsl:call-template name="__x_add_attribute">' 
			+ '<xsl:with-param name="name">' + node.attribs.name + '</xsl:with-param>'
			+ '<xsl:with-param name="value">' + value + '</xsl:with-param>'
			+ '</xsl:call-template>';

		utils.replace(node, utils.makeDom(xsl)[0]);
		return false;
	}
};