/**
 * <t:add-attributes> transformer. Takes a node-set
 * as a parameter and creates attributes on parent element
 * from each element in node-set
 */
var utils = require('../utils');
var expression = require('expression-parser');

function isSimpleXpath(tokens) {
	return tokens.length === 1 
		&& !('key' in tokens[0])
		&& !('condition' in tokens[0]);
}

function isNodeSet(tokens) {
	return tokens.every(function(token) {
		return 'key' in token;
	});
}

module.exports = function(node) {
	if (!utils.isTemplateNode(node, 'attribute-set')) {
		return;
	}
	
	var select = node.attribs.select;
	if (select) {
		var tokens = expression.parse(select);
		var xsl = '', expr;

		if (isSimpleXpath(tokens)) {
			expr = select;
		} else if (expression.isNodeSet(tokens)) {
			xsl += '<xsl:variable name="__x_attribute_set">';
			xsl += tokens.map(function(token) {
				var out = '<' + token.key + '><xsl:value-of select="' + token.value + '"/></' + token.key + '>';
				if (token.xpathCondition) {
					out = '<xsl:if test="' + token.xpathCondition + '">' + out + '</xsl:if>';
				}
				return out;
			});
			xsl += '</xsl:variable>';
			expr = 'exsl:node-set($__x_attribute_set_)';
		} else {
			throw new Error('Unexpected "select" attribute value in <' + node.name + '> element: ' + select + '\n'
					+ 'It must contain either simple XPath expression or node-set'
				);
		}

		 xsl += '<xsl:call-template name="__x_add_attribute_set">' 
			+ '<xsl:with-param name="nodeset" select="' + expr + '" />'
			+ '<xsl:with-param name="prefix">' + (node.attribs.prefix || '') + '</xsl:with-param>'
			+ '</xsl:call-template>';

		utils.replace(node, utils.makeDom(xsl));
		return false;
	}
};