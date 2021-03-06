/**
 * Attributes transformer: transforms XPath superset to simple XPath
 * and XSL.
 */
var expression = require('xpath-superset');
var utils = require('../utils');

function createAttributeNodeSet(name, tokens) {
	var glue = ' ';
	var varName = '__x_attr_' + name;
	var code = '<xsl:variable name="' + varName + '">'
		+ tokens.map(function(token) {
			if (typeof token === 'string') {
				return '<string>' + token + '</string>';
			}

			if (Array.isArray(token)) {
				return token.map(function(t) {
					var condition = (t.condition === '?') ? t.value : t.condition;
					if (condition) {
						return '<xsl:if test="' + condition + '"><token><xsl:value-of select="' + t.value + '" /></token></xsl:if>';
					}

					return '<token><xsl:value-of select="' + t.value + '" /></token>';
				}).join('\n');
			}
		}).join('\n')
		+ '</xsl:variable>';

	code += '<xsl:call-template name="__x_attribute">\n'
	code += '<xsl:with-param name="name" select="\'' + name + '\'" />'
	code += '<xsl:with-param name="nodeset" select="exsl:node-set($' + varName + ')" />'
	code += '<xsl:with-param name="glue" select="\'' + glue + '\'" />'
	code += '</xsl:call-template>';

	return utils.makeDom(code);
}

module.exports = function(node) {
	if (!utils.isTag(node)) {
		return;
	}

	var fragment = [];
	Object.keys(node.attribs).forEach(function(name) {
		var value = node.attribs[name];
		var tokens = expression(value);
		if (!expression.hasXpathSuperset(tokens)) {
			return;
		}

		var dom = createAttributeNodeSet(name, tokens);
		fragment = fragment.concat(dom);
		delete node.attribs[name];
	});

	utils.prepend(node, fragment);
	return node;
};
